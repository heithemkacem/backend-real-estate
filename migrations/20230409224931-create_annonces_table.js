'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('Annonces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nb_chambre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      categorieId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key:'id'
        },
        onDelete: "CASCADE"
      },
      ville: {
        allowNull: false,
        type: Sequelize.STRING
      },
      region: {
        allowNull: true,
        type: Sequelize.STRING
      },
     
    
      prix: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      desc: {
        allowNull: true,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('Annonces');

  }
};
