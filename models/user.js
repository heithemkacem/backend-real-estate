'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Reservation);
    }
  };
  User.init({
    image: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
   
    ville: DataTypes.STRING,
    region: DataTypes.STRING,
    role: DataTypes.STRING,
    token: DataTypes.STRING,
    expiresToken: DataTypes.DATE
   

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};