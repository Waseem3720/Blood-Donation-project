
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/donor', require('./routes/donorRoutes'));
app.use('/api/seeker', require('./routes/seekerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Simple health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error Handler (must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));