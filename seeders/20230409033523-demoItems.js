'use strict';
const uuidv4 = require('uuid').v4;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const itemList = [];
      const sizeList = ["S", "M", "L", "XL", "XXL"];
      for (let i= 1; i<=30; i++) {
        for (let size of sizeList) {
          itemList.push({
            id: uuidv4(),
            size: size,
            products_id: i,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      }
   await queryInterface.bulkInsert('items', itemList, {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
