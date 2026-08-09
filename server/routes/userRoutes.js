const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/me
// @desc    Get current logged-in user (full profile)
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      role: user.role,
      bloodGroup: user.bloodGroup,
      age: user.age,
      isAvailable: user.isAvailable,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { fullName, phoneNumber, location, age, bloodGroup } = req.body;

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (location) updateFields.location = location;
    if (age) updateFields.age = age;
    // Donors cannot change their blood group once registered
    if (bloodGroup && req.user.role !== 'donor') updateFields.bloodGroup = bloodGroup;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      role: user.role,
      bloodGroup: user.bloodGroup,
      age: user.age,
      isAvailable: user.isAvailable,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
