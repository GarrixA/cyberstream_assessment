"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("attendance", "overtimeNotifiedAt", {
			type: Sequelize.DATE,
			allowNull: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn("attendance", "overtimeNotifiedAt");
	},
};
