"use strict";

const { EMPLOYMENT_TYPES, now } = require("./helpers/seed-ids");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("employment_types", [
			{ id: EMPLOYMENT_TYPES.FULL_TIME, name: "Full-time", description: "Full-time employment", createdAt: now(), updatedAt: now() },
			{ id: EMPLOYMENT_TYPES.PART_TIME, name: "Part-time", description: "Part-time employment", createdAt: now(), updatedAt: now() },
			{ id: EMPLOYMENT_TYPES.CONTRACT, name: "Contract", description: "Contract employment", createdAt: now(), updatedAt: now() },
			{ id: EMPLOYMENT_TYPES.INTERN, name: "Intern", description: "Internship", createdAt: now(), updatedAt: now() },
		]);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("employment_types", null, {});
	},
};
