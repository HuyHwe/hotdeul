'use strict';
const {users, items, products} = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('items_users', [{
     users_id: (await users.findOne({where: {email: "huyhwe1@fakemail.com"}})).id,
     items_id: (await items.findOne({where: {size: "M"}})).id,
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
    users_id: (await users.findOne({where: {email: "huyhwe1@fakemail.com"}})).id,
    items_id: (await items.findOne({where: {size: "L"}})).id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
], {});
    
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('items_users', null, {});
  }
};
