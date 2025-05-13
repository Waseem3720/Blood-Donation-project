const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
const bcrypt = require('bcryptjs');

// Register User
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber, location, role, bloodGroup, age } = req.body;
    
    const user = new User({
      fullName,
      email,
      password,
      phoneNumber,
      location,
      role,
      ...(role === 'donor' && { bloodGroup, age, isAvailable: true })
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        location: user.location,
        ...(role === 'donor' && { bloodGroup: user.bloodGroup, age: user.age })
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      location: user.location
    };

    if (user.role === 'donor') {
      userData.bloodGroup = user.bloodGroup;
      userData.age = user.age;
    }

    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

// Google OAuth Login
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    
    let user = await User.findOne({ email });
    
    if (user) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          location: user.location,
          ...(user.role === 'donor' && { bloodGroup: user.bloodGroup, age: user.age })
        }
      });
    }
    
    res.status(200).json({
      success: true,
      needsAdditionalInfo: true,
      googleData: {
        fullName: name,
        email,
        profilePicture: picture
      }
    });
  } catch (err) {
    next(err);
  }
};

// Complete Google Registration
exports.completeGoogleRegistration = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, location, role, bloodGroup, age } = req.body;
    
    const user = new User({
      fullName,
      email,
      phoneNumber,
      location,
      role,
      isGoogleAuth: true,
      ...(role === 'donor' && { bloodGroup, age, isAvailable: true })
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        location: user.location,
        ...(role === 'donor' && { bloodGroup: user.bloodGroup, age: user.age })
      }
    });
  } catch (err) {
    next(err);
  }
};