'use strict';
const uuidv4 = require('uuid').v4;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('items', [{
     id: uuidv4(),
     size: "M",
     products_id: 1,
     createdAt: new Date(),
     updatedAt: new Date(),

    },
    {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
 
     },
    {
      id: uuidv4(),
      size: "L",
      products_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      
     },
     {
      id: uuidv4(),
      size: "M",
      products_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      
     },
     {
      id: uuidv4(),
      size: "L",
      products_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      
     }], {});
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
