'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({users}) {
      orders.belongsTo(users, {foreignKey:"users_id"});
    }
  }
  orders.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    users_id: DataTypes.UUID,
    items_id: {
      type: DataTypes.ARRAY(DataTypes.UUID)
    }
  }, {
    sequelize,
    modelName: 'orders',
  });
  return orders;
};