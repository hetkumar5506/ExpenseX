// File: backend/utils/cronJobs.js
// ACTION: Replace the ENTIRE file content with this.

const cron = require('node-cron');
const { pool } = require('../config/db');

const checkUpcomingPayments = async () => {
    console.log('\n--- [CRON START - SQL DATEDIFF V2] ---');
    try {
        const [users] = await pool.query(`
            SELECT u.id, s.upcoming_payments 
            FROM users u 
            JOIN settings s ON u.id = s.user_id
        `);

        for (const user of users) {
            if (!user.upcoming_payments) continue;

            let payments = [];
            try {
                payments = typeof user.upcoming_payments === 'string'
                    ? JSON.parse(user.upcoming_payments)
                    : user.upcoming_payments;
            } catch (e) {
                console.log(`[CRON ERROR] User ${user.id} has invalid JSON. Skipping. Data:`, user.upcoming_payments);
                continue;
            }
            
            if (!Array.isArray(payments) || payments.length === 0) continue;

            for (const payment of payments) {
                const dueDate = payment.due_date;
                if (!dueDate) continue;

                const query = 'SELECT DATEDIFF(?, CURDATE()) as days_until_due;';
                const [[result]] = await pool.query(query, [dueDate]);
                
                console.log(`[CRON DEBUG] User: ${user.id}, Payment: "${payment.name}", Due: ${dueDate}, Days Until Due: ${result.days_until_due}`);
                
                if (result.days_until_due === 1) {
                    const message = `Reminder: Your payment for "${payment.name}" of ₹${payment.amount} is due tomorrow.`;
                    
                    const [existing] = await pool.query(
                        'SELECT id FROM notifications WHERE user_id = ? AND message LIKE ? AND DATE(timestamp) = CURDATE()',
                        [user.id, `%${payment.name}%`]
                    );

                    if (existing.length === 0) {
                        // --- THE FIX IS HERE ---
                        // We are now inserting a value into the 'timestamp' column.
                        await pool.query(
                            'INSERT INTO notifications (user_id, message, timestamp) VALUES (?, ?, NOW())',
                            [user.id, message]
                        );
                        console.log(`[CRON SUCCESS] >>> Notification created for user ${user.id}.`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('[CRON FATAL ERROR]', error);
    }
    console.log('--- [CRON END] ---\n');
};

const initCronJobs = () => {
    cron.schedule('*/1 * * * *', checkUpcomingPayments);
    console.log('🗓️ Cron jobs initialized.');
};

module.exports = { initCronJobs };