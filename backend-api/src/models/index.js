const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Verification = require('./Verification');
const Listing = require('./Listing');

// Associations

// User <-> Project
User.hasMany(Project, { foreignKey: 'owner_id', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Project <-> Verification
Project.hasMany(Verification, { foreignKey: 'project_id', as: 'verifications' });
Verification.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// User <-> Verification (Auditor)
User.hasMany(Verification, { foreignKey: 'verifier_id', as: 'audits' });
Verification.belongsTo(User, { foreignKey: 'verifier_id', as: 'auditor' });

// Listing Associations
Project.hasMany(Listing, { foreignKey: 'project_id', as: 'listings' });
Listing.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

User.hasMany(Listing, { foreignKey: 'seller_id', as: 'sales' });
Listing.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    
    // Enable PostGIS Extension
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced & PostGIS enabled.');
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
};

module.exports = { 
  sequelize, 
  initDB, 
  User, 
  Project, 
  Verification, 
  Listing 
};
