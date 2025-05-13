const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes with JWT and admin role
router.use(protect);
router.use(authorize('admin'));

// Users
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Blood Requests
router.get('/requests', adminController.getAllBloodRequests);

// Statistics
router.get('/stats', adminController.getStatistics);

module.exports = router;