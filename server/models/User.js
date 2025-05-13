const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a full name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    select: false
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  role: {
    type: String,
    enum: ['donor', 'seeker', 'admin'],
    default: 'donor'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function() { return this.role === 'donor'; }
  },
  age: {
    type: Number,
    required: function() { return this.role === 'donor'; },
    min: [18, 'Age must be at least 18'],
    max: [65, 'Age must be at most 65']
  },
  isAvailable: {
    type: Boolean,
    default: function() { return this.role === 'donor'; }
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String
  },
  googleId: {
    type: String
  }
}, { timestamps: true });

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);