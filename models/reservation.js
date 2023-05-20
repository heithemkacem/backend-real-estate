'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
   
    static associate(models) {
        models.Reservation.belongsTo(models.User, {
            foreignKey: 'userId'
          })

          models.Reservation.belongsTo(models.Annonces, {
            foreignKey: 'annonceId'
          })
    }
  }

  Reservation.init({
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: DataTypes.STRING,
    total: DataTypes.INTEGER,
   
   

  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};