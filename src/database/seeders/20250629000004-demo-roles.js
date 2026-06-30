"use strict";

const { ROLES, STATUSES, now } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("roles", [
			{ id: ROLES.ADMIN, name: "Admin", description: "Full system access", statusId: STATUSES.ROLE_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: ROLES.HR, name: "HR", description: "Manage employees", statusId: STATUSES.ROLE_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: ROLES.MANAGER, name: "Manager", description: "View team and update limited info", statusId: STATUSES.ROLE_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: ROLES.EMPLOYEE, name: "Employee", description: "View own profile", statusId: STATUSES.ROLE_ACTIVE, createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("roles", null, {});
	},
};
