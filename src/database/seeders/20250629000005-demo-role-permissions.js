"use strict";

const { ROLES, PERMISSIONS, now, uuidv4 } = require("./helpers/seed-ids");

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

const HR_PERMISSIONS = [
	PERMISSIONS.EMPLOYEE_CREATE,
	PERMISSIONS.EMPLOYEE_READ_ALL,
	PERMISSIONS.EMPLOYEE_UPDATE,
	PERMISSIONS.EMPLOYEE_DEACTIVATE,
	PERMISSIONS.SALARY_VIEW,
	PERMISSIONS.DEPARTMENT_MANAGE,
	PERMISSIONS.ATTENDANCE_READ_ALL,
	PERMISSIONS.LEAVE_MANAGE,
	PERMISSIONS.PAYROLL_MANAGE,
];

const MANAGER_PERMISSIONS = [
	PERMISSIONS.EMPLOYEE_READ_TEAM,
	PERMISSIONS.EMPLOYEE_UPDATE_LIMITED,
	PERMISSIONS.ATTENDANCE_READ_ALL,
	PERMISSIONS.LEAVE_MANAGE,
];

const EMPLOYEE_PERMISSIONS = [
	PERMISSIONS.EMPLOYEE_READ_OWN,
	PERMISSIONS.EMPLOYEE_UPDATE_OWN,
	PERMISSIONS.ATTENDANCE_READ_OWN,
	PERMISSIONS.LEAVE_READ_OWN,
];

const rolePermissionMap = [
	{ roleId: ROLES.ADMIN, permissions: ALL_PERMISSIONS },
	{ roleId: ROLES.HR, permissions: HR_PERMISSIONS },
	{ roleId: ROLES.MANAGER, permissions: MANAGER_PERMISSIONS },
	{ roleId: ROLES.EMPLOYEE, permissions: EMPLOYEE_PERMISSIONS },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		const rows = [];
		for (const entry of rolePermissionMap) {
			for (const permissionId of entry.permissions) {
				rows.push({
					id: uuidv4(),
					roleId: entry.roleId,
					permissionId,
					createdAt: now(),
					updatedAt: now(),
				});
			}
		}
		await queryInterface.bulkInsert("role_permissions", rows);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("role_permissions", null, {});
	},
};
