const { Project } = require('../models');
const { verifyCoordinates } = require('../services/satelliteService');

exports.createProject = async (req, res) => {
  try {
    const { name, locationName, lat, long, credits } = req.body;
    
    // 1. Perform Satellite Verification (AI/MRV Layer)
    const satelliteData = await verifyCoordinates(parseFloat(lat), parseFloat(long));
    
    // 2. Determine Validity
    // If NDVI (Vegetation Index) is > 0.5, we assume it's valid forest/mangrove
    const isValid = satelliteData.ndvi > 0.5;

    // 3. Save to DB
    const point = { type: 'Point', coordinates: [long, lat] };
    
    const newProject = await Project.create({
      name,
      locationName,
      coordinates: point,
      carbonCreditAmount: credits,
      status: isValid ? 'VERIFIED' : 'PENDING',
      verificationHash: `SAT-${Date.now()}-${satelliteData.ndvi}` // Mock Hash
    });

    res.status(201).json({
        success: true,
        project: newProject,
        satelliteAnalysis: satelliteData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};