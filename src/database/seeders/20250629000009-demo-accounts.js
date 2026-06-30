"use strict";

const { USERS, STATUSES, now, uuidv4 } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("accounts", [
			{ id: uuidv4(), userId: USERS.JOHN_ADMIN, bankName: "First National Bank", accountNumber: 1000001234, accountName: "John Admin", statusId: STATUSES.ACCOUNT_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.MARY_HR, bankName: "City Bank", accountNumber: 1000005678, accountName: "Mary Johnson", statusId: STATUSES.ACCOUNT_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.ALEX_MANAGER, bankName: "Tech Credit Union", accountNumber: 1000009012, accountName: "Alex Thompson", statusId: STATUSES.ACCOUNT_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.JANE_EMPLOYEE, bankName: "First National Bank", accountNumber: 1000003456, accountName: "Jane Doe", statusId: STATUSES.ACCOUNT_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.PETER_EMPLOYEE, bankName: "City Bank", accountNumber: 1000007890, accountName: "Peter Smith", statusId: STATUSES.ACCOUNT_ACTIVE, createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.MIKE_EMPLOYEE, bankName: "Legacy Bank", accountNumber: 1000002468, accountName: "Mike Wilson", statusId: STATUSES.ACCOUNT_INACTIVE, createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("accounts", null, {});
	},
};
