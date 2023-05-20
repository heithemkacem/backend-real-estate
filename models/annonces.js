'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Annonces extends Model {
   
    static associate(models) {
      models.Annonces.belongsTo(models.Categories, {
        foreignKey: 'categorieId'
      })
      models.Annonces.hasMany(models.Reservation);



      
    }
  }

  Annonces.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    nb_chambre: DataTypes.STRING,
    categorieId: DataTypes.INTEGER,
    ville: DataTypes.STRING,
    region: DataTypes.STRING,
   
    prix: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    // token: DataTypes.STRING,
    // expiresToken: DataTypes.DATE
   

  }, {
    sequelize,
    modelName: 'Annonces',
  });
  return Annonces;
};