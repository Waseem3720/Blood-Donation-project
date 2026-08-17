const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Composite index to ensure one subscription endpoint per user or query efficiently
subscriptionSchema.index({ user: 1, endpoint: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
