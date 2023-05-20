'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key:'id'
        },
        onDelete: "CASCADE"
      },
      annonceId: {
 
        type: Sequelize.INTEGER,
        references: {
          model: 'Annonces',
          key:'id'
        },
        onDelete: "CASCADE"
      
      },
      status: {
        allowNull: false,
      
        type: Sequelize.STRING
      },  
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
   
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Feedbacks');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

  }
};
