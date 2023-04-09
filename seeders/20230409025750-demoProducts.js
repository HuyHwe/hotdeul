'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [{
      id: 1,
      name: 'Áo cardigan nữ trắng',
      description: 'chất liệu bọc dù siêu bền dài 3m',
      price: 139,
      quantity_total: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Áo len nữ trắng',
      description: 'chất liệu bọc dù siêu bền dài 3m',
      price: 159,
      quantity_total: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
