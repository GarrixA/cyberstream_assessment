"use strict";

const { STATUSES, now } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("statuses", [
			{ id: STATUSES.USER_ACTIVE, name: "Active", category: "user", description: "Employee is active", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.USER_INACTIVE, name: "Inactive", category: "user", description: "Employee is inactive", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.USER_SUSPENDED, name: "Suspended", category: "user", description: "Employee is suspended", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.USER_TERMINATED, name: "Terminated", category: "user", description: "Employee is terminated", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.USER_ON_LEAVE, name: "On Leave", category: "user", description: "Employee is on leave", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.ROLE_ACTIVE, name: "Active", category: "role", description: "Role is active", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.ACCOUNT_ACTIVE, name: "Active", category: "account", description: "Bank account is active", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.ACCOUNT_INACTIVE, name: "Inactive", category: "account", description: "Bank account is inactive", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.POSITION_ACTIVE, name: "Active", category: "position", description: "Position is active", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.POSITION_INACTIVE, name: "Inactive", category: "position", description: "Position is inactive", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.TOKEN_ACTIVE, name: "Active", category: "token", description: "Token is active", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.TOKEN_INVALIDATED, name: "Invalidated", category: "token", description: "Token has been invalidated", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.DEPARTMENT_ACTIVE, name: "Active", category: "department", description: "Department is active", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.DEPARTMENT_INACTIVE, name: "Inactive", category: "department", description: "Department is inactive", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.LEAVE_PENDING, name: "Pending", category: "leave", description: "Leave request pending", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.LEAVE_APPROVED, name: "Approved", category: "leave", description: "Leave request approved", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.LEAVE_REJECTED, name: "Rejected", category: "leave", description: "Leave request rejected", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.LEAVE_CANCELLED, name: "Cancelled", category: "leave", description: "Leave request cancelled", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.PAYROLL_PENDING, name: "Pending", category: "payroll", description: "Payroll pending", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.PAYROLL_PROCESSED, name: "Processed", category: "payroll", description: "Payroll processed", createdAt: now(), updatedAt: now() },
			{ id: STATUSES.PAYROLL_PAID, name: "Paid", category: "payroll", description: "Payroll paid", createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("statuses", null, {});
	},
};
