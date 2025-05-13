const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const donorController = require('../controllers/donorController');

// Get all matching blood requests for the donor
router.get('/requests', protect, donorController.getMatchingRequests);

// Accept a specific blood request
router.put('/requests/:requestId/accept', protect, donorController.acceptRequest);

// Toggle donor availability status
router.put('/availability', protect, donorController.toggleAvailability);

// Get donation history (accepted requests by the donor)
router.get('/donation-history', protect, donorController.getDonationHistory);

// Mark donation as completed
router.put('/requests/:requestId/complete', protect, donorController.completeDonation);

module.exports = router;
