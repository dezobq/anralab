// Notification model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'TeamMembers',
      key: 'id'
    }
  },
  channelId: {
    type: DataTypes.ENUM('email', 'sms', 'whatsapp'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  relatedTaskId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Tasks',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Notifications',
  timestamps: true
});

module.exports = Notification;