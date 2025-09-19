// Migration to create OnboardingResponse table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OnboardingResponses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      responseText: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      confidenceLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100
        }
      },
      sourceDocumentation: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      questionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'OnboardingQuestions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OnboardingResponses');
  }
};