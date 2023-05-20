'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedbacks extends Model {
    static associate(models) {
      models.Feedbacks.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      models.Feedbacks.belongsTo(models.Annonces, {
        foreignKey: 'annonceId'
      })
    }
  
  };
  Feedbacks.init({
    message: DataTypes.STRING,
    // status: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'Feedbacks',
  });
  return Feedbacks;
};