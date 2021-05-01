'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHashed = await bcrypt.hash("12345678", 10);
    return queryInterface.bulkInsert("Users", [
      {
        fullname: "Indra Cahya",
        email: "indra@email.com",
        password: passwordHashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Dumbways.id",
        email: "dumbways@email.com",
        password: passwordHashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
