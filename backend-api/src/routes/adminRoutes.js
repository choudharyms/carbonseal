const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verificationController = require('../controllers/verificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/pending', authMiddleware, adminController.getPendingProjects);
router.post('/verify', authMiddleware, verificationController.triggerVerification);

module.exports = router;
