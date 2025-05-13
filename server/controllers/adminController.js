const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const { isValidObjectId } = require('mongoose');

// Get all users with pagination and search
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { 
      role: { $in: ['donor', 'seeker'] },
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ]
    };

    const [users, count] = await Promise.all([
      User.find(query)
        .select('-password -googleId -isGoogleAuth')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .lean(),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      count: users.length,
      totalUsers: count,
      data: users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users. Please try again later.'
    });
  }
};

// Get all blood requests with filters
exports.getAllBloodRequests = async (req, res) => {
  try {
    const { status, bloodGroup, location, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (location) query.location = { $regex: location, $options: 'i' };

    const [requests, count] = await Promise.all([
      BloodRequest.find(query)
        .populate('seeker', 'fullName email phoneNumber location')
        .populate('acceptedBy', 'fullName email phoneNumber location bloodGroup')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .lean(),
      BloodRequest.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      count: requests.length,
      totalRequests: count,
      data: requests
    });
  } catch (err) {
    console.error('Error fetching blood requests:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blood requests. Please try again later.'
    });
  }
};

// Delete user and related data
exports.deleteUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete related data in parallel
    await Promise.all([
      BloodRequest.deleteMany({ 
        $or: [
          { seeker: user._id },
          { acceptedBy: user._id }
        ] 
      }),
      Notification.deleteMany({ user: user._id })
    ]);

    res.status(200).json({
      success: true,
      message: 'User and all related data deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user. Please try again later.'
    });
  }
};

// Get statistics for dashboard
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments({ role: { $in: ['donor', 'seeker'] } }),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'seeker' }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: 'pending' }),
      BloodRequest.countDocuments({ status: 'accepted' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: stats[0],
        donors: stats[1],
        seekers: stats[2],
        requests: stats[3],
        pendingRequests: stats[4],
        acceptedRequests: stats[5]
      }
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics. Please try again later.'
    });
  }
};

// Block/Unblock user
exports.toggleUserBlock = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: {
        isBlocked: user.isBlocked
      }
    });
  } catch (err) {
    console.error('Error toggling user block:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status. Please try again later.'
    });
  }
};