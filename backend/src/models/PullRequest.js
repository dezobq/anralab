// PullRequest model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PullRequest = sequelize.define('PullRequest', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'merged'),
    allowNull: false,
    defaultValue: 'open'
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tasks',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false
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
  }
}, {
  tableName: 'PullRequests',
  timestamps: true
});

module.exports = PullRequest;