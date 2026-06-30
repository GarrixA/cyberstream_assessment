"use strict";

const bcrypt = require("bcrypt");
const {
	USERS,
	ROLES,
	DEPARTMENTS,
	POSITIONS,
	EMPLOYMENT_TYPES,
	STATUSES,
	now,
} = require("./helpers/seed-ids");
const {
	generateEmployeeCode,
} = require("./helpers/seed-generators");

const DEMO_PASSWORD = "Password@123";

const demoUsers = [
	{
		id: USERS.JOHN_ADMIN,
		firstName: "John",
		lastName: "Admin",
		email: "john.admin@cyberstream.com",
		phone: "+1234567890",
		positionId: POSITIONS.CTO,
		departmentId: DEPARTMENTS.ENGINEERING,
		roleId: ROLES.ADMIN,
		managerId: null,
		employmentTypeId: EMPLOYMENT_TYPES.FULL_TIME,
		salary: 150000.0,
		statusId: STATUSES.USER_ACTIVE,
		profilePicture: null,
		address: "123 Admin Street, Tech City",
		emergencyContactName: "Sarah Admin",
		emergencyContactPhone: "+1234567891",
		emergencyContactRelation: "Spouse",
		dateJoined: "2024-01-15",
	},
	{
		id: USERS.MARY_HR,
		firstName: "Mary",
		lastName: "Johnson",
		email: "mary.hr@cyberstream.com",
		phone: "+1234567892",
		positionId: POSITIONS.HR_MANAGER,
		departmentId: DEPARTMENTS.HR,
		roleId: ROLES.HR,
		managerId: USERS.JOHN_ADMIN,
		employmentTypeId: EMPLOYMENT_TYPES.FULL_TIME,
		salary: 95000.0,
		statusId: STATUSES.USER_ACTIVE,
		profilePicture: null,
		address: "456 HR Avenue, Tech City",
		emergencyContactName: "Tom Johnson",
		emergencyContactPhone: "+1234567893",
		emergencyContactRelation: "Brother",
		dateJoined: "2024-02-01",
	},
	{
		id: USERS.ALEX_MANAGER,
		firstName: "Alex",
		lastName: "Thompson",
		email: "alex.manager@cyberstream.com",
		phone: "+1234567894",
		positionId: POSITIONS.SENIOR_ENGINEER,
		departmentId: DEPARTMENTS.ENGINEERING,
		roleId: ROLES.MANAGER,
		managerId: USERS.JOHN_ADMIN,
		employmentTypeId: EMPLOYMENT_TYPES.FULL_TIME,
		salary: 120000.0,
		statusId: STATUSES.USER_ACTIVE,
		profilePicture: null,
		address: "789 Manager Lane, Tech City",
		emergencyContactName: "Lisa Thompson",
		emergencyContactPhone: "+1234567895",
		emergencyContactRelation: "Spouse",
		dateJoined: "2024-03-10",
	},
	{
		id: USERS.JANE_EMPLOYEE,
		firstName: "Jane",
		lastName: "Doe",
		email: "jane.doe@cyberstream.com",
		phone: "+1234567896",
		positionId: POSITIONS.SOFTWARE_ENGINEER,
		departmentId: DEPARTMENTS.ENGINEERING,
		roleId: ROLES.EMPLOYEE,
		managerId: USERS.ALEX_MANAGER,
		employmentTypeId: EMPLOYMENT_TYPES.FULL_TIME,
		salary: 85000.0,
		statusId: STATUSES.USER_ACTIVE,
		profilePicture: null,
		address: "321 Engineer Road, Tech City",
		emergencyContactName: "Mark Doe",
		emergencyContactPhone: "+1234567897",
		emergencyContactRelation: "Father",
		dateJoined: "2024-04-20",
	},
	{
		id: USERS.PETER_EMPLOYEE,
		firstName: "Peter",
		lastName: "Smith",
		email: "peter.smith@cyberstream.com",
		phone: "+1234567898",
		positionId: POSITIONS.SOFTWARE_ENGINEER,
		departmentId: DEPARTMENTS.ENGINEERING,
		roleId: ROLES.EMPLOYEE,
		managerId: USERS.ALEX_MANAGER,
		employmentTypeId: EMPLOYMENT_TYPES.FULL_TIME,
		salary: 82000.0,
		statusId: STATUSES.USER_ACTIVE,
		profilePicture: null,
		address: "654 Developer Blvd, Tech City",
		emergencyContactName: "Anna Smith",
		emergencyContactPhone: "+1234567899",
		emergencyContactRelation: "Mother",
		dateJoined: "2024-05-05",
	},
	{
		id: USERS.MIKE_EMPLOYEE,
		firstName: "Mike",
		lastName: "Wilson",
		email: "mike.wilson@cyberstream.com",
		phone: "+1234567800",
		positionId: POSITIONS.HR_OFFICER,
		departmentId: DEPARTMENTS.HR,
		roleId: ROLES.EMPLOYEE,
		managerId: USERS.MARY_HR,
		employmentTypeId: EMPLOYMENT_TYPES.PART_TIME,
		salary: 45000.0,
		statusId: STATUSES.USER_INACTIVE,
		profilePicture: null,
		address: "987 Inactive Street, Tech City",
		emergencyContactName: "Kate Wilson",
		emergencyContactPhone: "+1234567801",
		emergencyContactRelation: "Sister",
		dateJoined: "2023-11-01",
	},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		const password = await bcrypt.hash(DEMO_PASSWORD, 10);
		const users = [];

		for (const [index, user] of demoUsers.entries()) {
			users.push({
				...user,
				employeeCode: generateEmployeeCode(index + 1),
				password,
				lastPasswordChanged: now(),
				createdAt: now(),
				updatedAt: now(),
			});
		}

		await queryInterface.bulkInsert("users", users);

		console.log("\n[demo-users] All seeded users share this password:");
		console.log(`  ${DEMO_PASSWORD}`);

		await queryInterface.bulkUpdate(
			"departments",
			{ managerId: USERS.JOHN_ADMIN, updatedAt: now() },
			{ id: DEPARTMENTS.ENGINEERING },
		);
		await queryInterface.bulkUpdate(
			"departments",
			{ managerId: USERS.MARY_HR, updatedAt: now() },
			{ id: DEPARTMENTS.HR },
		);
	},
	async down(queryInterface) {
		await queryInterface.bulkDelete("users", null, {});
	},
};
