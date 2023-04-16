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
    static associate({ products}) {
      // define association here
      items.belongsTo(products, {foreignKey: "products_id"});
    }
  }
  items.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    size: DataTypes.STRING,
    products_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'items',
  });
  return items;
};