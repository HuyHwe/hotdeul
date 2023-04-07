'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({items_users, products}) {
      // define association here
      items.hasMany(items_users, {foreignKey: "items_id"});
      items.belongsTo(products, {foreignKey: "products_id"});
    }
  }
  items.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    size: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    products_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'items',
  });
  return items;
};