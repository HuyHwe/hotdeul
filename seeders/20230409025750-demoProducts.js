'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const productList = [];
    for (let i = 1; i<= 30; i++) {
      productList.push({
          id: i,
          name: (i % 2 == 0) ? 'Áo cardigan nữ trắng' : 'Áo len nữ',
          description: 'chất liệu bọc dù siêu bền dài 3m chỉ từ 40 nghìn',
          price: 139 + i,
          images: [`product (${Math.ceil(Math.random()*10)}).jpg`],
          createdAt: new Date(),
          updatedAt: new Date()
        
      })
    }
    await queryInterface.bulkInsert('products', productList, {});
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
