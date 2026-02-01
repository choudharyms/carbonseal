const { Project, sequelize } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const { name, description, ecosystem_type, boundary, location_name } = req.body;
    const owner_id = req.user.id; // From Auth Middleware

    console.log("Received Payload:", JSON.stringify(req.body, null, 2));

    // BYPASS: Use Fallback if invalid
    let validBoundary = boundary;
    if (!boundary || !boundary.type || boundary.type !== 'Polygon') {
        console.warn("⚠️ Invalid/Missing GeoJSON. Using fallback polygon for demo.");
        validBoundary = {
            type: "Polygon",
            coordinates: [
                [
                    [88.614, 21.556],
                    [88.624, 21.556],
                    [88.624, 21.566],
                    [88.614, 21.566],
                    [88.614, 21.556]
                ]
            ]
        };
    }
    
    // Create Project
    const newProject = await Project.create({
      owner_id,
      name,
      description,
      ecosystem_type,
      location_name,
      boundary: validBoundary, 
      status: 'SUBMITTED'
    });

    res.status(201).json({
      success: true,
      project: newProject
    });

  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ where: { owner_id: req.user.id } });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { status: 'VERIFIED' }, // Public only sees verified
            include: ['owner'] 
        });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};