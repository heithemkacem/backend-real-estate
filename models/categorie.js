'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Categories.hasMany(models.Annonces);
    }

  };
 
  Categories.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,
   
    // token: DataTypes.STRING,
    // expiresToken: DataTypes.DATE
   

  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};