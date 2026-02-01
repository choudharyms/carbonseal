const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Define Carbon Project Model with Geo-Spatial Data
const Project = sequelize.define('Project', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  locationName: { type: DataTypes.STRING, allowNull: false },
  // PostGIS Geometry Column (Point: Lat/Long)
  coordinates: { 
    type: DataTypes.GEOMETRY('POINT'), 
    allowNull: false 
  },
  // Polygon for project area boundaries
  areaBoundary: {
    type: DataTypes.GEOMETRY('POLYGON'),
    allowNull: true
  },
  carbonCreditAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { 
    type: DataTypes.ENUM('PENDING', 'VERIFIED', 'RETIRED'), 
    defaultValue: 'PENDING' 
  },
  ipfsMetadataHash: { type: DataTypes.STRING }, // Link to report
  verificationHash: { type: DataTypes.STRING } // Blockchain hash
});

// Sync and Enable PostGIS
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    
    // Enable PostGIS Extension
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced & PostGIS enabled.');
  } catch (error) {
    console.error('❌ Database error:', error);
  }
};

module.exports = { sequelize, Project, initDB };