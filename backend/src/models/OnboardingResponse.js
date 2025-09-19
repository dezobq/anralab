// OnboardingResponse model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OnboardingResponse = sequelize.define('OnboardingResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  responseText: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  confidenceLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  sourceDocumentation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'OnboardingQuestions',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'OnboardingResponses',
  timestamps: true
});

module.exports = OnboardingResponse;