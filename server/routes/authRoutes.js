const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateCompleteGoogle } = require('../utils/validator');

router.post('/register', (req, res, next) => {
  validateRegister(req, res, () => {
    authController.register(req, res, next);
  });
});

router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

router.post('/complete-google-signup', (req, res, next) => {
  validateCompleteGoogle(req, res, () => {
    authController.completeGoogleRegistration(req, res, next);
  });
});

module.exports = router;