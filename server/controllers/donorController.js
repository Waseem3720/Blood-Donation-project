const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const { sendNotification } = require('../socket/notificationService');

// Get matching blood requests for a donor
const getMatchingRequests = async (req, res) => {
  try {
    const donor = await User.findById(req.user.id).select('bloodGroup location');

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const requests = await BloodRequest.find({
      bloodGroup: donor.bloodGroup,
      location: donor.location,
      status: 'pending'
    }).populate('seeker', 'fullName phoneNumber location');

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error('Error fetching matching requests:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
};

// Accept a blood request by donor
const acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is no longer available' });
    }

    request.status = 'accepted';
    request.acceptedBy = req.user.id;
    request.acceptedAt = Date.now();

    await request.save();

    // Notify the seeker
    const { io, connectedUsers } = req.app.get('socketio');
    await sendNotification(
      io,
      connectedUsers,
      request.seeker,
      `Your blood request for ${request.bloodGroup} has been accepted`,
      { requestId: request._id, donorId: req.user.id }
    );

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};

// Toggle donor availability
const toggleAvailability = async (req, res, next) => {
  try {
    const donor = await User.findById(req.user.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    res.status(200).json({ success: true, data: donor.isAvailable });
  } catch (err) {
    next(err);
  }
};

// Get donation history (accepted requests by this donor)
const getDonationHistory = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      acceptedBy: req.user.id,
      status: { $in: ['accepted', 'completed'] } // Include both accepted and completed requests
    }).populate('seeker', 'fullName phoneNumber location')
      .sort({ acceptedAt: -1 }); // Sort by most recent first

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error('Error fetching donation history:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donation history'
    });
  }
};

// Mark donation as completed
const completeDonation = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.acceptedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to complete this donation' 
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only accepted requests can be completed' 
      });
    }

    request.status = 'completed';
    await request.save();

    // Notify the seeker
    const { io, connectedUsers } = req.app.get('socketio');
    await sendNotification(
      io,
      connectedUsers,
      request.seeker,
      `Your blood request for ${request.bloodGroup} has been completed`,
      { requestId: request._id, donorId: req.user.id }
    );

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMatchingRequests,
  acceptRequest,
  toggleAvailability,
  getDonationHistory,
  completeDonation
};
