const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', projectController.getAllProjects);

// Protected (Developer)
router.post('/', authMiddleware, projectController.createProject);
router.get('/my', authMiddleware, projectController.getMyProjects);

module.exports = router;
