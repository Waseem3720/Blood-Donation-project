const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const donorController = require('../controllers/donorController');

// Verify all required functions exist
if (typeof protect !== 'function') {
  throw new Error('Auth middleware is not a function');
}
if (!donorController.getMatchingRequests || typeof donorController.getMatchingRequests !== 'function') {
  throw new Error('getMatchingRequests controller is missing or not a function');
}

router.get('/requests', protect, donorController.getMatchingRequests);
router.put('/requests/:requestId/accept', protect, donorController.acceptRequest);
router.put('/availability', protect, donorController.toggleAvailability);
router.get('/history', protect, donorController.getDonationHistory);

module.exports = router;