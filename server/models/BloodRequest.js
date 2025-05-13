const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  // Reference to the seeker (the one who created the request)
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Required blood group
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },

  // Location where blood is needed
  location: {
    type: String,
    required: true
  },

  // Optional note for extra information
  note: {
    type: String,
    maxlength: 500
  },

  // Unit required for the blood request
  unitRequired: {
    type: Number,
    required: true,
    min: 1 // Ensure that at least 1 unit is required
  },

  // Status of the blood request
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },

  // The donor (User) who accepted the request
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Timestamp of when the request was accepted
  acceptedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
