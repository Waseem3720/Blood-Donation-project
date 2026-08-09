const express = require('express');
const router = express.Router();
const {
  createBloodRequest,
  getMyRequests,
  cancelRequest,
  getDonorLocations,
  searchDonors
} = require('../controllers/seekerController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes with JWT and seeker role
router.use(protect);
router.use(authorize('seeker'));

// @route   POST /api/seeker/requests
// @desc    Create a new blood request
// @access  Private/Seeker
router.post('/requests', createBloodRequest);

// @route   GET /api/seeker/requests
// @desc    Get seeker's blood requests
// @access  Private/Seeker
router.get('/requests', getMyRequests);

// @route   PUT /api/seeker/requests/:requestId/cancel
// @desc    Cancel a blood request
// @access  Private/Seeker
router.put('/requests/:requestId/cancel', cancelRequest);

// @route   GET /api/seeker/donor-locations
// @desc    Get available donor locations
// @access  Private/Seeker
router.get('/donor-locations', getDonorLocations);

// @route   GET /api/seeker/donors
// @desc    Search/filter donors by bloodGroup and location
// @access  Private/Seeker
router.get('/donors', searchDonors);

module.exports = router;
