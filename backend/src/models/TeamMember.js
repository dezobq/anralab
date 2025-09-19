// TeamMember model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('member', 'admin'),
    allowNull: false,
    defaultValue: 'member'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  availabilityStatus: {
    type: DataTypes.ENUM('available', 'busy', 'offline', 'away'),
    allowNull: false,
    defaultValue: 'available'
  },
  githubHandle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'TeamMembers',
  timestamps: true
});

module.exports = TeamMember;