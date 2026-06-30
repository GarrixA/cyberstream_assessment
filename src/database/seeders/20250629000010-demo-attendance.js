"use strict";

const { USERS, now, uuidv4 } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const loginTime = new Date(yesterday.setHours(9, 0, 0, 0));
		const logoutTime = new Date(yesterday.setHours(17, 30, 0, 0));

		await queryInterface.bulkInsert("attendance", [
			{ id: uuidv4(), userId: USERS.JANE_EMPLOYEE, loginAt: loginTime, logoutAt: logoutTime, ipAddress: "192.168.1.10", deviceInfo: "Chrome/macOS", createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.PETER_EMPLOYEE, loginAt: loginTime, logoutAt: logoutTime, ipAddress: "192.168.1.11", deviceInfo: "Firefox/Windows", createdAt: now(), updatedAt: now() },
			{ id: uuidv4(), userId: USERS.ALEX_MANAGER, loginAt: loginTime, logoutAt: logoutTime, ipAddress: "192.168.1.12", deviceInfo: "Safari/macOS", createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("attendance", null, {});
	},
};
