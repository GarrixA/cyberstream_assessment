"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		// Idempotent: safe even if 20250630000001 already applied the change.
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
