const { verifyProject } = require('../services/dmrvService');
const { Project } = require('../models');

exports.triggerVerification = async (req, res) => {
    try {
        const { projectId } = req.body;
        
        // In prod, check if req.user.role === 'ADMIN'
        
        const verification = await verifyProject(projectId);
        
        res.json({
            success: true,
            verification
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
