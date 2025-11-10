// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { checkConnection } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { initCronJobs } = require('./utils/cronJobs');
const { apiLimiter, authLimiter } = require('./middleware/rateLimitMiddleware');

// Load environment variables
dotenv.config();
checkConnection();

const app = express();
const PORT = process.env.PORT || 5050;


// --- THE CORS FIX: This must be near the top ---
// Explicitly allow requests ONLY from your React development server.
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
// --- END OF FIX ---


// Core Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder middleware for user uploads (e.g., profile photos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'ExpenseX API is running!' });
});


// --- API ROUTES & SECURITY MIDDLEWARE ---
// Apply the stricter 'authLimiter' only to authentication routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));

// Apply the general 'apiLimiter' to all subsequent API routes
app.use('/api/categories', apiLimiter, require('./routes/categoryRoutes'));
app.use('/api/expenses', apiLimiter, require('./routes/expenseRoutes'));
app.use('/api/scan', apiLimiter, require('./routes/scanRoutes'));
app.use('/api/search', apiLimiter, require('./routes/searchRoutes'));
app.use('/api/users', apiLimiter, require('./routes/userRoutes'));
app.use('/api/notifications', apiLimiter, require('./routes/notificationRoutes'));
app.use('/api/reports', apiLimiter, require('./routes/reportRoutes'));


// --- INITIALIZE CRON JOBS ---
initCronJobs();


// --- CENTRALIZED ERROR HANDLER ---
// This must be the last piece of middleware
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});