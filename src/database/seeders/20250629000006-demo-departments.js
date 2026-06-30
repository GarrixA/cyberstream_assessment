"use strict";

const { DEPARTMENTS, STATUSES, now } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("departments", [
			{ id: DEPARTMENTS.ENGINEERING, name: "Engineering", description: "Software engineering team", statusId: STATUSES.DEPARTMENT_ACTIVE, managerId: null, createdAt: now(), updatedAt: now() },
			{ id: DEPARTMENTS.HR, name: "Human Resources", description: "HR and people operations", statusId: STATUSES.DEPARTMENT_ACTIVE, managerId: null, createdAt: now(), updatedAt: now() },
			{ id: DEPARTMENTS.FINANCE, name: "Finance", description: "Finance and accounting", statusId: STATUSES.DEPARTMENT_ACTIVE, managerId: null, createdAt: now(), updatedAt: now() },
			{ id: DEPARTMENTS.OPERATIONS, name: "Operations", description: "Business operations", statusId: STATUSES.DEPARTMENT_ACTIVE, managerId: null, createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("departments", null, {});
	},
};
