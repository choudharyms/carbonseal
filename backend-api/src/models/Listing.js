const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  token_id: {
    type: DataTypes.BIGINT, // ERC-1155 Token ID
    allowNull: false
  },
  amount_available: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  price_per_tonne_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'SOLD', 'CANCELLED'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'listings',
  timestamps: true
});

module.exports = Listing;
