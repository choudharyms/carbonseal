const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, portfolioController.getPortfolio);
router.post('/retire', authMiddleware, portfolioController.retireTokens);

module.exports = router;
