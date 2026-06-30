"use strict";

const { PERMISSIONS, now } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("permissions", [
			{ id: PERMISSIONS.EMPLOYEE_CREATE, code: "employee.create", name: "Create Employee", description: "Add new employees", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_READ_ALL, code: "employee.read.all", name: "View All Employees", description: "View all employee records", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_READ_TEAM, code: "employee.read.team", name: "View Team", description: "View team members", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_READ_OWN, code: "employee.read.own", name: "View Own Profile", description: "View own employee profile", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_UPDATE, code: "employee.update", name: "Update Employee", description: "Edit employee records", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_UPDATE_LIMITED, code: "employee.update.limited", name: "Update Limited Info", description: "Update limited employee info for team", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_UPDATE_OWN, code: "employee.update.own", name: "Update Own Profile", description: "Update own profile fields", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.EMPLOYEE_DEACTIVATE, code: "employee.deactivate", name: "Deactivate Employee", description: "Deactivate or terminate employees", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.ROLE_MANAGE, code: "role.manage", name: "Manage Roles", description: "Change employee roles and permissions", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.SALARY_VIEW, code: "salary.view", name: "View Salary", description: "View employee salary information", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.DEPARTMENT_MANAGE, code: "department.manage", name: "Manage Departments", description: "Create and manage departments", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.AUDIT_READ, code: "audit.read", name: "View Audit Logs", description: "View system audit logs", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.ATTENDANCE_READ_ALL, code: "attendance.read.all", name: "View All Attendance", description: "View all attendance records", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.ATTENDANCE_READ_OWN, code: "attendance.read.own", name: "View Own Attendance", description: "View own attendance records", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.LEAVE_MANAGE, code: "leave.manage", name: "Manage Leave", description: "Approve and manage leave requests", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.LEAVE_READ_OWN, code: "leave.read.own", name: "View Own Leave", description: "View own leave requests", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.PAYROLL_MANAGE, code: "payroll.manage", name: "Manage Payroll", description: "Manage payroll records", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.STATUS_MANAGE, code: "status.manage", name: "Manage Statuses", description: "Create and manage system statuses", createdAt: now(), updatedAt: now() },
			{ id: PERMISSIONS.PERMISSION_MANAGE, code: "permission.manage", name: "Manage Permissions", description: "Create and manage system permissions", createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("permissions", null, {});
	},
};
