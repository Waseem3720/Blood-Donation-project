const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update logged-in user's profile (excluding email and role)
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { fullName, phoneNumber, location } = req.body;

    if (!fullName || !phoneNumber || !location) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.location = location;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
