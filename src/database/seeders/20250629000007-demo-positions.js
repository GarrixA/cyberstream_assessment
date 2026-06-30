"use strict";

const { POSITIONS, DEPARTMENTS, STATUSES, now } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("positions", [
			{ id: POSITIONS.CTO, title: "Chief Technology Officer", description: "Head of engineering", departmentId: DEPARTMENTS.ENGINEERING, statusId: STATUSES.POSITION_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: POSITIONS.SENIOR_ENGINEER, title: "Senior Software Engineer", description: "Senior engineering role", departmentId: DEPARTMENTS.ENGINEERING, statusId: STATUSES.POSITION_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: POSITIONS.HR_MANAGER, title: "HR Manager", description: "Manages HR team", departmentId: DEPARTMENTS.HR, statusId: STATUSES.POSITION_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: POSITIONS.HR_OFFICER, title: "HR Officer", description: "HR operations", departmentId: DEPARTMENTS.HR, statusId: STATUSES.POSITION_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: POSITIONS.FINANCE_MANAGER, title: "Finance Manager", description: "Manages finance team", departmentId: DEPARTMENTS.FINANCE, statusId: STATUSES.POSITION_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: POSITIONS.SOFTWARE_ENGINEER, title: "Software Engineer", description: "Software development", departmentId: DEPARTMENTS.ENGINEERING, statusId: STATUSES.POSITION_ACTIVE, createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("positions", null, {});
	},
};
