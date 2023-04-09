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
    static associate({items, users}) {
      // define association here
      items_users.belongsTo(items, {foreignKey: "items_id"});
      items_users.belongsTo(users, {foreignKey: "users_id"});
    }
  }
  items_users.init({
    items_id: DataTypes.UUID,
    users_id: DataTypes.UUID,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'items_users',
  });
  return items_users;
};