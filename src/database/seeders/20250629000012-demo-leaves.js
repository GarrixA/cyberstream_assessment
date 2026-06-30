"use strict";

const { USERS, STATUSES, now, uuidv4 } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("leaves", [
			{
				id: uuidv4(),
				userId: USERS.JANE_EMPLOYEE,
				leaveName: "Family Vacation",
				leaveType: "annual",
				duration: 10,
				durationUnit: "days",
				startDate: "2025-07-01",
				endDate: "2025-07-10",
				reason: "Family vacation",
				statusId: STATUSES.LEAVE_APPROVED,
				approvedById: USERS.ALEX_MANAGER,
				createdAt: now(),
				updatedAt: now(),
			},
			{
				id: uuidv4(),
				userId: USERS.PETER_EMPLOYEE,
				leaveName: "Medical Recovery",
				leaveType: "sick",
				duration: 3,
				durationUnit: "days",
				startDate: "2025-06-15",
				endDate: "2025-06-17",
				reason: "Medical recovery",
				statusId: STATUSES.LEAVE_PENDING,
				approvedById: null,
				createdAt: now(),
				updatedAt: now(),
			},
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("leaves", null, {});
	},
};
