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

    // Destructure bloodGroup, unitRequired, note, and location from the request body
    const { bloodGroup, unitRequired, note, location } = req.body;

    // Validate unitRequired
    if (!unitRequired || unitRequired <= 0) {
      return res.status(400).json({ success: false, message: 'Unit required must be greater than 0' });
    }

    // If location is not provided, return an error
    if (!location) {
      return res.status(400).json({ success: false, message: 'Location is required' });
    }

    // Create a new blood request using the provided location
    const request = new BloodRequest({
      seeker: req.user.id,
      bloodGroup,
      location, // Use the location from the user input
      unitRequired, // Include the unitRequired field
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

// Get seeker's blood requests with accepted donor details
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

// Donor accepts a blood request
const acceptBloodRequest = async (req, res, next) => {
  try {
    const donor = await User.findById(req.user.id);

    if (!donor || donor.role !== 'donor') {
      return res.status(403).json({ success: false, message: 'Only donors can accept requests' });
    }

    const request = await BloodRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is not available for acceptance' });
    }

    // Accept the request
    request.acceptedBy = donor._id;
    request.status = 'accepted';
    request.acceptedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      data: request
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  createBloodRequest,
  getMyRequests,
  cancelRequest,
  acceptBloodRequest
};
