// backend/controllers/userController.js
const userModel = require('../models/userModel');
const settingsModel = require('../models/settingsModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db'); // Needed for the raw delete query

// @desc    Update user profile (name, theme)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, theme } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (theme && ['light', 'dark'].includes(theme)) {
      updateData.theme = theme;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    await userModel.updateUser(req.user.id, updateData);
    const updatedUser = await userModel.findUserById(req.user.id);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updateUserPassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide current and new passwords.' });
  }

  try {
    const user = await userModel.findUserByEmail(req.user.email);
    
    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      await userModel.updatePassword(req.user.id, newPassword);
      res.json({ message: 'Password updated successfully.' });
    } else {
      res.status(401).json({ message: 'Current password is incorrect.' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user settings (including upcoming payments)
// @route   GET /api/users/settings
// @access  Private
const getUserSettings = async (req, res, next) => {
    try {
        const settings = await settingsModel.getSettings(req.user.id);
        if(!settings) {
            return res.status(404).json({ message: 'Settings not found for this user.' });
        }
        res.json(settings);
    } catch (error) {
        next(error);
    }
};


// @desc    Update upcoming payments
// @route   PUT /api/users/settings/upcoming-payments
// @access  Private
const updateUpcomingPayments = async (req, res, next) => {
    const { payments } = req.body;

    if (!Array.isArray(payments)) {
        return res.status(400).json({ message: 'Payments must be an array.' });
    }

    try {
        await settingsModel.updateUpcomingPayments(req.user.id, payments);
        res.json({ message: 'Upcoming payments updated successfully.', payments });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload or update user profile photo
// @route   PUT /api/users/profile-photo
// @access  Private
const uploadProfilePhoto = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const newPhotoPath = req.file.filename;

    try {
        const user = await userModel.findUserById(req.user.id);
        const oldPhotoPath = user.profile_photo;

        await userModel.updateUser(req.user.id, { profile_photo: newPhotoPath });

        if (oldPhotoPath && oldPhotoPath !== 'default_avatar.png') {
            const fullPath = path.join(__dirname, '..', 'uploads', oldPhotoPath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Failed to delete old profile photo:', err);
                }
            });
        }
        
        res.json({ message: 'Profile photo updated successfully.', profile_photo: newPhotoPath });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   POST /api/users/account/delete
// @access  Private
const deleteUserAccount = async (req, res, next) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required to delete account.' });
    }
    
    try {
        const user = await userModel.findUserByEmail(req.user.email);
        
        if (user && (await bcrypt.compare(password, user.password))) {
            await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
            res.json({ message: 'Your account and all associated data have been permanently deleted.' });
        } else {
            res.status(401).json({ message: 'Incorrect password.' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
  updateUserProfile,
  updateUserPassword,
  getUserSettings,
  updateUpcomingPayments,
  uploadProfilePhoto,
  deleteUserAccount,
};