const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Verification = sequelize.define('Verification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  satellite_source: {
    type: DataTypes.STRING,
    defaultValue: 'Sentinel-2'
  },
  capture_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ndvi_score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estimated_biomass: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  carbon_credits_calculated: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ipfs_report_hash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  blockchain_tx_hash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verifier_id: {
    type: DataTypes.UUID,
    allowNull: true // Can be null if system automated
  },
  verified_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'verifications',
  timestamps: true
});

module.exports = Verification;
