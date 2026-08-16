const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
};

const validateRegister = (req, res, next) => {
  const { fullName, email, password, phoneNumber, location, role, bloodGroup, age } = req.body;
  
  if (!fullName || !email || !password || !phoneNumber || !location || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  if (!['donor', 'seeker'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  if (role === 'donor') {
    if (!bloodGroup || !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) {
      return res.status(400).json({ success: false, message: 'Valid blood group is required for donors' });
    }
    if (!age || age < 18 || age > 65) {
      return res.status(400).json({ success: false, message: 'Age must be between 18 and 65 for donors' });
    }
  }

  next();
};

const validateCompleteGoogle = (req, res, next) => {
  const { fullName, email, phoneNumber, location, role, bloodGroup, age } = req.body;
  
  if (!fullName || !email || !phoneNumber || !location || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (!['donor', 'seeker'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  if (role === 'donor') {
    if (!bloodGroup || !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) {
      return res.status(400).json({ success: false, message: 'Valid blood group is required for donors' });
    }
    if (!age || age < 18 || age > 65) {
      return res.status(400).json({ success: false, message: 'Age must be between 18 and 65 for donors' });
    }
  }

  next();
};

module.exports = { validateRequest, validateRegister, validateCompleteGoogle };