'use strict';
import bcrypt from 'bcryptjs';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    // Insert user into USER table
    await queryInterface.bulkInsert('USER', [{
      fullName: 'devel oper',
      email: 'developer@gmail.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('USER', { email: 'developer@gmail.com' }, {});
  }
};
