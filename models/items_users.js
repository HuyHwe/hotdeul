'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class items_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({products, users}) {
      // define association here
      items_users.belongsTo(products, {foreignKey: "products_id"});
      items_users.belongsTo(users, {foreignKey: "users_id"});
    }
  }
  items_users.init({
    products_id: DataTypes.INTEGER,
    items_size: DataTypes.STRING,
    users_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'items_users',
  });
  return items_users;
};