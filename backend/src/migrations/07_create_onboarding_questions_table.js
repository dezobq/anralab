// Migration to create OnboardingQuestion table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OnboardingQuestions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      questionText: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      context: {
        type: Sequelize.JSON,
        allowNull: true
      },
      askedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'TeamMembers',
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
    await queryInterface.dropTable('OnboardingQuestions');
  }
};