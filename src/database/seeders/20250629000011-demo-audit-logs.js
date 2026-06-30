"use strict";

const { USERS, DEPARTMENTS, now, uuidv4 } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("audit_logs", [
			{
				id: uuidv4(),
				actorId: USERS.JOHN_ADMIN,
				action: "created",
				entityType: "employee",
				entityId: USERS.JANE_EMPLOYEE,
				description: "Admin John created Employee Jane.",
				metadata: JSON.stringify({ employeeCode: "EMP-004" }),
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: uuidv4(),
				actorId: USERS.ALEX_MANAGER,
				action: "updated",
				entityType: "employee",
				entityId: USERS.PETER_EMPLOYEE,
				description: "Manager Alex updated Employee Peter.",
				metadata: JSON.stringify({ fields: ["phone", "address"] }),
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: uuidv4(),
				actorId: USERS.MARY_HR,
				action: "updated",
				entityType: "employee",
				entityId: USERS.JANE_EMPLOYEE,
				description: "HR changed Employee Mary's department.",
				metadata: JSON.stringify({ departmentId: DEPARTMENTS.ENGINEERING }),
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: uuidv4(),
				actorId: USERS.JOHN_ADMIN,
				action: "deactivated",
				entityType: "employee",
				entityId: USERS.MIKE_EMPLOYEE,
				description: "Admin deactivated Employee Mike.",
				metadata: JSON.stringify({ reason: "End of contract" }),
				createdAt: now(),
				updatedAt: now(),
			},
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("audit_logs", null, {});
	},
};
