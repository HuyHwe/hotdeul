'use strict';
const {
  Model, DATE
} = require('sequelize');
const items_users = require('./items_users');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({items, items_users}) {
      products.hasMany(items_users, {foreignKey: "products_id"});
      products.hasMany(items, {foreignKey:"products_id"});
    }
  }
  products.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    images: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};