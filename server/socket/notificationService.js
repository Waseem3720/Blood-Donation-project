const Notification = require('../models/Notification');
const User = require('../models/User');

const sendNotification = async (io, connectedUsers, userId, message, data = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const socketId = connectedUsers[userId];
    if (socketId) {
      io.to(socketId).emit('notification', {
        message,
        data,
        timestamp: new Date()
      });
    }

    // Save to database
    const notification = new Notification({
      user: userId,
      message,
      data,
      read: false
    });
    
    await notification.save();
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

const notifyMatchingDonors = async (io, connectedUsers, bloodRequest) => {
  try {
    const matchingDonors = await User.find({
      bloodGroup: bloodRequest.bloodGroup,
      location: bloodRequest.location,
      isAvailable: true,
      role: 'donor'
    });

    await Promise.all(matchingDonors.map(donor => 
      sendNotification(
        io,
        connectedUsers,
        donor._id,
        `New blood request for ${bloodRequest.bloodGroup} in your area`,
        { requestId: bloodRequest._id }
      )
    ));
  } catch (error) {
    console.error('Error notifying matching donors:', error.message);
  }
};

module.exports = {
  sendNotification,
  notifyMatchingDonors
};