const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const projectController = require('../controllers/projectController');

// GET all
router.get('/', async (req, res) => {
  const projects = await Project.findAll();
  res.json(projects);
});

// POST new (Uses the Controller we just made)
router.post('/', projectController.createProject);

module.exports = router;