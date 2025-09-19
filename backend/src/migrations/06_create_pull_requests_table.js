// Migration to create PullRequest table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PullRequests', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'merged'),
        allowNull: false,
        defaultValue: 'open'
      },
      taskId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      authorId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PullRequests');
  }
};