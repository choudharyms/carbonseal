const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin only route in reality
router.post('/verify', authMiddleware, verificationController.triggerVerification);

module.exports = router;
