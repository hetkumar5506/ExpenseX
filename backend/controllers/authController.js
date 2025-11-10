// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { pool } = require('../config/db'); // <-- IMPORT POOL FOR LOGGING

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await userModel.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = await userModel.createUser(name, email, password);
    if (newUser) {
      res.status(201).json({
        message: 'User registered successfully',
        token: generateToken(newUser.id),
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await userModel.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // --- ADDED: SESSION LOGGING ---
      try {
        const ip_address = req.ip || req.socket.remoteAddress;
        const device_info = req.headers['user-agent'];
        await pool.query(
            'INSERT INTO session_logs (user_id, ip_address, device_info) VALUES (?, ?, ?)',
            [user.id, ip_address, device_info]
        );
        console.log(`[Auth] Logged successful login for user ${user.id}`);
      } catch (logError) {
        // If logging fails, don't block the login. Just log the error on the server.
        console.error('[Auth] Failed to create session log:', logError);
      }
      // --- END OF SESSION LOGGING ---

      res.json({
        message: 'Login successful',
        token: generateToken(user.id),
        user: { id: user.id, name: user.name, email: user.email, theme: user.theme },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};