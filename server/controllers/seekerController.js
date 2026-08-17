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

// Create blood request
const createBloodRequest = async (req, res, next) => {
  try {
    const seeker = await User.findById(req.user.id);
    
    if (!seeker) {
      return res.status(404).json({ success: false, message: 'Seeker not found' });
    }
    
    const { bloodGroup, note, location } = req.body;
    
    const request = new BloodRequest({
      seeker: req.user.id,
      bloodGroup,
      location: location || seeker.location,
      note
    });
    
    await request.save();

    // Trigger Web Push Notifications to matching donors
    (async () => {
      try {
        const reqLocation = (location || seeker.location || '').trim();
        const matchingDonors = await User.find({
          role: 'donor',
          bloodGroup: request.bloodGroup,
          location: { $regex: new RegExp(`^${reqLocation}$`, 'i') }
        }).select('_id');
        
        const donorIds = matchingDonors.map(d => d._id);
        if (donorIds.length > 0) {
          await sendPushToUsers(donorIds, {
            title: 'Urgent Blood Request',
            body: `Blood group ${request.bloodGroup} needed in ${reqLocation}`,
            url: '/donor'
          });
        }
      } catch (pushErr) {
        console.error('Push notification error on request creation:', pushErr);
      }
    })();

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get seeker's blood requests
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ seeker: req.user.id })
      .populate('acceptedBy', 'fullName email phoneNumber bloodGroup');
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Cancel blood request
const cancelRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.requestId,
      seeker: req.user.id
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled'
      });
    }
    
    request.status = 'cancelled';
    await request.save();
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get available donor locations (optionally filtered by bloodGroup)
const getDonorLocations = async (req, res, next) => {
  try {
    const { bloodGroup } = req.query;
    const filter = { role: 'donor' };
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }
    const locations = await User.find(filter).distinct('location');
    res.status(200).json({
      success: true,
      data: locations.filter(loc => loc && loc.trim() !== '')
    });
  } catch (err) {
    next(err);
  }
};

// Search / filter donors by bloodGroup and location
const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, location } = req.query;
    const filter = { role: 'donor' };

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }
    if (location) {
      filter.location = { $regex: new RegExp(location, 'i') };
    }

    const donors = await User.find(filter).select('fullName email phoneNumber location bloodGroup age isAvailable');
    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBloodRequest,
  getMyRequests,
  cancelRequest,
  getDonorLocations,
  searchDonors
};
