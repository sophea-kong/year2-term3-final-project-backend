'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SCHEDULE', 'bookingId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'BOOKING',
        key: 'bookingId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SCHEDULE', 'bookingId');
  }
};
