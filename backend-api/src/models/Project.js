const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ecosystem_type: {
    type: DataTypes.ENUM('MANGROVE', 'SEAGRASS', 'WETLAND', 'PEATLAND'),
    allowNull: false
  },
  location_name: { // Keeping for frontend compatibility
    type: DataTypes.STRING,
    allowNull: true
  },
  // PostGIS Geometry Column (Polygon for boundaries)
  boundary: {
    type: DataTypes.GEOMETRY('POLYGON'),
    allowNull: false
  },
  // Centroid for simple map markers
  coordinates: { 
    type: DataTypes.GEOMETRY('POINT'), 
    allowNull: true 
  },
  area_in_hectares: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'VERIFIED', 'REJECTED'),
    defaultValue: 'DRAFT'
  },
  registry_contract_id: {
    type: DataTypes.BIGINT, // On-chain ID
    allowNull: true
  }
}, {
  tableName: 'projects',
  timestamps: true
});

module.exports = Project;
