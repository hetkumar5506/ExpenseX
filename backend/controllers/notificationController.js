// backend/controllers/notificationController.js
const { pool } = require('../config/db');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
    try {
        const [notifications] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC',
            [req.user.id]
        );
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
const markAsRead = async (req, res, next) => {
    try {
        await pool.query(
            'UPDATE notifications SET read_status = TRUE WHERE user_id = ? AND read_status = FALSE',
            [req.user.id]
        );
        res.json({ message: 'All notifications marked as read.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getNotifications, markAsRead };