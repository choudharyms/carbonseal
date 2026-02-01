const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('DEVELOPER', 'BUYER', 'AUDITOR', 'ADMIN'),
    defaultValue: 'DEVELOPER'
  },
  wallet_address: {
    type: DataTypes.STRING,
    allowNull: true // Generated after signup
  },
  encrypted_private_key: {
    type: DataTypes.TEXT,
    allowNull: true // Managed by system
  },
  kyc_status: {
    type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  // Legacy fields kept for compatibility but can be deprecated
  walletBalance: { type: DataTypes.FLOAT, defaultValue: 0 },
  carbonOffset: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
