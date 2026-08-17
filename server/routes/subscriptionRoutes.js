const express = require('express');
const router = express.Router();
const { getVapidPublicKey, saveSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/vapid-key', protect, getVapidPublicKey);
router.post('/subscribe', protect, saveSubscription);

module.exports = router;
