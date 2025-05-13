require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminData = {
      fullName: 'Ali',
      email: 'muhammadali5915910@gmail.com',
      password: 'admin123',
      phoneNumber: '03231003993',
       location:'Lahore',
      role: 'admin'
    };
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin
    const admin = new User(adminData);
    await admin.save();
    
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();