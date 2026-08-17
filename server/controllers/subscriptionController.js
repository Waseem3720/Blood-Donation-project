const Subscription = require('../models/Subscription');

// Get public VAPID key for frontend subscription creation
const getVapidPublicKey = async (req, res, next) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      return res.status(500).json({ success: false, message: 'VAPID_PUBLIC_KEY not configured on server' });
    }
    res.status(200).json({
      success: true,
      publicKey
    });
  } catch (err) {
    next(err);
  }
};

// Save or update push subscription for current user
const saveSubscription = async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription payload. Endpoint and keys (p256dh, auth) are required.'
      });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id, endpoint },
      { user: req.user.id, endpoint, keys },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Subscription saved successfully',
      data: subscription
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVapidPublicKey,
  saveSubscription
};
