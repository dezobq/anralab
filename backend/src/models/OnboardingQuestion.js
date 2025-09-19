// OnboardingQuestion model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OnboardingQuestion = sequelize.define('OnboardingQuestion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  context: {
    type: DataTypes.JSON,
    allowNull: true
  },
  askedById: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'TeamMembers',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'OnboardingQuestions',
  timestamps: true
});

module.exports = OnboardingQuestion;