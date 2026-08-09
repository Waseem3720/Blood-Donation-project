const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const { notifyMatchingDonors } = require('../socket/notificationService');

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

    // Notify matching donors
    const { io, connectedUsers } = req.app.get('socketio');
    await notifyMatchingDonors(io, connectedUsers, request);
    
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
