const Notification = require('../models/Notification');
const User = require('../models/User');

const configureSocket = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000
  });

  const connectedUsers = {};

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user
    socket.on('register', async (userId) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        connectedUsers[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID ${socket.id}`);
      } catch (error) {
        console.error('Registration error:', error.message);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Heartbeat to keep connection alive
  setInterval(() => {
    io.emit('ping', { heartbeat: new Date() });
  }, 50000);

  return {
    io,
    connectedUsers
  };
};

module.exports = configureSocket;