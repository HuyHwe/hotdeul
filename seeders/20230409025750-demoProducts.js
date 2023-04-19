'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [{
      id: 1,
      name: 'Áo cardigan nữ trắng',
      description: 'chất liệu bọc dù siêu bền dài 3m',
      price: 139,
      images: ["5401e38a3d624ca6143c12aa2f3ed7a5.jpg"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Áo len nữ trắng',
      description: 'chất liệu bọc dù siêu bền dài 3m',
      price: 159,
      images: ["ao-len-kieu-han-quoc-cuc-dep-2-jpg-1632381797-23092021142317.jpg"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
