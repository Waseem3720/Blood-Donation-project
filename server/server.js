require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const configureSocket = require('./socket/socketHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Safely parse JSON only when body is expected
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/donor', require('./routes/donorRoutes'));
app.use('/api/seeker', require('./routes/seekerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check route for server status
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Global error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Set up Socket.IO
const { io, connectedUsers } = configureSocket(server);
app.set('socketio', { io, connectedUsers });
