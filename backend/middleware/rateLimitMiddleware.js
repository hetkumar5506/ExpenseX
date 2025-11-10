// File: backend/middleware/rateLimitMiddleware.js
// ACTION: Replace the ENTIRE file content with this updated version.

const rateLimit = require('express-rate-limit');

// --- NEW, RELAXED SETTINGS FOR DEVELOPMENT ---

// General limiter for most API routes - now very permissive
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 1000, // Allow 1000 requests per minute (basically unlimited for testing)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after a minute.',
});

// Stricter limiter for auth routes - also relaxed for testing
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 100, // Allow 100 login attempts per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after a minute.',
});

module.exports = { apiLimiter, authLimiter };