const { Project, Verification } = require('../models');

exports.getPendingProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { status: 'SUBMITTED' },
            include: ['owner']
        });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
