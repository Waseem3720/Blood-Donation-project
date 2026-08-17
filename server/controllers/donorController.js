const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const webpush = require('web-push');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const sendPushToUsers = async (userIds, payload) => {
  try {
    const subscriptions = await Subscription.find({ user: { $in: userIds } });
    const notifications = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: sub.keys
      };
      try {
        await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await Subscription.deleteOne({ _id: sub._id });
        } else {
          console.error('Error sending push notification:', err.message || err);
        }
      }
    });
    await Promise.allSettled(notifications);
  } catch (err) {
    console.error('Error in sendPushToUsers:', err);
  }
};

const getMatchingRequests = async (req, res) => {
  try {
    const donor = await User.findById(req.user.id).select('bloodGroup location');
    
    if (!donor) {
      return res.status(404).json({ 
        success: false,
        message: 'Donor not found' 
      });
    }

    const requests = await BloodRequest.find({
      bloodGroup: donor.bloodGroup,
      location: donor.location,
      status: 'pending'
    }).populate('seeker', 'fullName phoneNumber location');

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (err) {
    console.error('Error fetching matching requests:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    
    const request = await BloodRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is no longer available'
      });
    }
    
    request.status = 'accepted';
    request.acceptedBy = req.user.id;
    request.acceptedAt = Date.now();
    
    await request.save();

    // Trigger Web Push Notification to the Seeker who created the request
    (async () => {
      try {
        await sendPushToUsers([request.seeker], {
          title: 'Blood Request Accepted',
          body: 'Your blood request has been accepted.',
          url: '/seeker'
        });
      } catch (pushErr) {
        console.error('Push notification error on request acceptance:', pushErr);
      }
    })();

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const donor = await User.findById(req.user.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }
    
    donor.isAvailable = !donor.isAvailable;
    await donor.save();
    
    res.status(200).json({
      success: true,
      data: donor.isAvailable
    });
  } catch (err) {
    next(err);
  }
};

// Get donation history for the logged-in donor
const getDonationHistory = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({
      acceptedBy: req.user.id,
      status: { $in: ['accepted', 'completed'] }
    })
      .populate('seeker', 'fullName phoneNumber location')
      .sort({ acceptedAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMatchingRequests,
  acceptRequest,
  toggleAvailability,
  getDonationHistory
};