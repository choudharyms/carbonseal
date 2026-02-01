const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', marketplaceController.getListings);
router.post('/list', authMiddleware, marketplaceController.createListing);
router.post('/buy', authMiddleware, marketplaceController.buyListing);

module.exports = router;
