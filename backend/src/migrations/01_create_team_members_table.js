// Migration to create TeamMember table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TeamMembers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      role: {
        type: Sequelize.ENUM('member', 'admin'),
        allowNull: false,
        defaultValue: 'member'
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: true
      },
      availabilityStatus: {
        type: Sequelize.ENUM('available', 'busy', 'offline', 'away'),
        allowNull: false,
        defaultValue: 'available'
      },
      githubHandle: {
        type: Sequelize.STRING,
        allowNull: true
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
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TeamMembers');
  }
};