// Invitation model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  inviteeEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  inviterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'TeamMembers',
      key: 'id'
    }
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'expired', 'revoked'),
    allowNull: false,
    defaultValue: 'pending'
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfter: new Date().toISOString().split('T')[0]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Invitations',
  timestamps: true
});

module.exports = Invitation;