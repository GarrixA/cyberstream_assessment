"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.query(
			'ALTER TABLE "users" ALTER COLUMN "roleId" DROP NOT NULL;',
		);
	},

	async down(queryInterface) {
		await queryInterface.sequelize.query(
			'ALTER TABLE "users" ALTER COLUMN "roleId" SET NOT NULL;',
		);
	},
};
