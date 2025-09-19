// Migration to create Invitation table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invitations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      inviteeEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      inviterId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'TeamMembers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'expired', 'revoked'),
        allowNull: false,
        defaultValue: 'pending'
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isAfter: new Date().toISOString().split('T')[0]
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      acceptedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invitations');
  }
};