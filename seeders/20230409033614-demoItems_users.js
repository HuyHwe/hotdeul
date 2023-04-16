'use strict';
const {users, items, products} = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('items_users', [{
     users_id: (await users.findOne({where: {email: "huyhwe1@fakemail.com"}})).id,
     products_id: 1,
     items_size: "M",
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
    users_id: (await users.findOne({where: {email: "huyhwe1@fakemail.com"}})).id,
    products_id: 1,
    items_size: "L",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('items_users', null, {});
  }
};
