"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("leaves", "leaveName", {
			type: Sequelize.STRING,
			allowNull: true,
		});
		await queryInterface.addColumn("leaves", "duration", {
			type: Sequelize.INTEGER,
			allowNull: true,
		});
		await queryInterface.addColumn("leaves", "durationUnit", {
			type: Sequelize.ENUM("days", "weeks", "months"),
			allowNull: true,
		});

		await queryInterface.sequelize.query(`
			UPDATE leaves
			SET
				"leaveName" = INITCAP(REPLACE("leaveType"::text, '_', ' ')) || ' Leave',
				duration = ("endDate"::date - "startDate"::date + 1),
				"durationUnit" = 'days'
		`);

		await queryInterface.changeColumn("leaves", "leaveName", {
			type: Sequelize.STRING,
			allowNull: false,
		});
		await queryInterface.changeColumn("leaves", "duration", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});
		await queryInterface.changeColumn("leaves", "durationUnit", {
			type: Sequelize.ENUM("days", "weeks", "months"),
			allowNull: false,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("leaves", "durationUnit");
		await queryInterface.removeColumn("leaves", "duration");
		await queryInterface.removeColumn("leaves", "leaveName");
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_leaves_durationUnit";',
		);
	},
};
