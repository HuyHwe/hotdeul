'use strict';
const bcrypt = require("bcrypt");
const uuidv4 = require('uuid').v4;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      email: "huyhwe1@fakemail.com",
      name: "Demo Name 1",
      password: await bcrypt.hash("123123", 10),
      phone: "0987654321",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {

      id: uuidv4(),
      email: "huyhwe2@fakemail.com",
      name: "Demo Name 2",
      password: await bcrypt.hash("123123", 10),
      phone: "0987654322",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
