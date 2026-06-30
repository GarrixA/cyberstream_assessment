"use strict";

const { USERS, STATUSES, now, uuidv4 } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("payroll_records", [
			{
				id: uuidv4(),
				userId: USERS.JANE_EMPLOYEE,
				periodStart: "2025-05-01",
				periodEnd: "2025-05-31",
				grossSalary: 85000.0,
				deductions: 12750.0,
				netSalary: 72250.0,
				statusId: STATUSES.PAYROLL_PAID,
				notes: "May 2025 payroll",
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: uuidv4(),
				userId: USERS.PETER_EMPLOYEE,
				periodStart: "2025-05-01",
				periodEnd: "2025-05-31",
				grossSalary: 82000.0,
				deductions: 12300.0,
				netSalary: 69700.0,
				statusId: STATUSES.PAYROLL_PAID,
				notes: "May 2025 payroll",
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: uuidv4(),
				userId: USERS.ALEX_MANAGER,
				periodStart: "2025-06-01",
				periodEnd: "2025-06-30",
				grossSalary: 120000.0,
				deductions: 24000.0,
				netSalary: 96000.0,
				statusId: STATUSES.PAYROLL_PENDING,
				notes: "June 2025 payroll - pending",
				createdAt: now(),
				updatedAt: now(),
			},
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("payroll_records", null, {});
	},
};
