"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("statuses", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: { type: Sequelize.STRING, allowNull: false },
			category: {
				type: Sequelize.ENUM(
					"user",
					"role",
					"account",
					"position",
					"token",
					"department",
					"leave",
					"payroll",
				),
				allowNull: false,
			},
			description: { type: Sequelize.STRING, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("permissions", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			code: { type: Sequelize.STRING, allowNull: false, unique: true },
			name: { type: Sequelize.STRING, allowNull: false },
			description: { type: Sequelize.STRING, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("employment_types", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: { type: Sequelize.STRING, allowNull: false, unique: true },
			description: { type: Sequelize.STRING, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("roles", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: { type: Sequelize.STRING, allowNull: false, unique: true },
			description: { type: Sequelize.STRING, allowNull: true },
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("role_permissions", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			roleId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "roles", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			permissionId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "permissions", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.addIndex("role_permissions", ["roleId", "permissionId"], {
			unique: true,
			name: "role_permissions_unique",
		});

		await queryInterface.createTable("departments", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			name: { type: Sequelize.STRING, allowNull: false, unique: true },
			description: { type: Sequelize.STRING, allowNull: true },
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			managerId: { type: Sequelize.UUID, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("positions", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			title: { type: Sequelize.STRING, allowNull: false },
			description: { type: Sequelize.STRING, allowNull: true },
			departmentId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "departments", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("users", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			employeeCode: { type: Sequelize.STRING, allowNull: false, unique: true },
			firstName: { type: Sequelize.STRING, allowNull: false },
			lastName: { type: Sequelize.STRING, allowNull: false },
			email: { type: Sequelize.STRING, allowNull: false, unique: true },
			phone: { type: Sequelize.STRING, allowNull: true },
			password: { type: Sequelize.STRING, allowNull: false },
			positionId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "positions", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			departmentId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "departments", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			roleId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "roles", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			managerId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			employmentTypeId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "employment_types", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			salary: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			profilePicture: { type: Sequelize.STRING, allowNull: true },
			address: { type: Sequelize.TEXT, allowNull: true },
			emergencyContactName: { type: Sequelize.STRING, allowNull: true },
			emergencyContactPhone: { type: Sequelize.STRING, allowNull: true },
			emergencyContactRelation: { type: Sequelize.STRING, allowNull: true },
			dateJoined: { type: Sequelize.DATEONLY, allowNull: false },
			lastPasswordChanged: { type: Sequelize.DATE, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.addConstraint("departments", {
			fields: ["managerId"],
			type: "foreign key",
			name: "departments_managerId_users_fkey",
			references: { table: "users", field: "id" },
			onUpdate: "CASCADE",
			onDelete: "SET NULL",
		});

		await queryInterface.createTable("accounts", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			bankName: { type: Sequelize.STRING, allowNull: false },
			accountNumber: { type: Sequelize.BIGINT, allowNull: false },
			accountName: { type: Sequelize.STRING, allowNull: false },
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("tokens", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			token: { type: Sequelize.TEXT, allowNull: false },
			type: {
				type: Sequelize.ENUM("access", "refresh", "reset_password"),
				allowNull: false,
			},
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			expiresAt: { type: Sequelize.DATE, allowNull: true },
			invalidatedAt: { type: Sequelize.DATE, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("attendance", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			loginAt: { type: Sequelize.DATE, allowNull: false },
			logoutAt: { type: Sequelize.DATE, allowNull: true },
			ipAddress: { type: Sequelize.STRING, allowNull: true },
			deviceInfo: { type: Sequelize.STRING, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("audit_logs", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			actorId: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			action: { type: Sequelize.STRING, allowNull: false },
			entityType: { type: Sequelize.STRING, allowNull: false },
			entityId: { type: Sequelize.UUID, allowNull: true },
			description: { type: Sequelize.TEXT, allowNull: false },
			metadata: { type: Sequelize.JSONB, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("leaves", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			leaveType: {
				type: Sequelize.ENUM("annual", "sick", "unpaid", "maternity", "paternity", "other"),
				allowNull: false,
			},
			startDate: { type: Sequelize.DATEONLY, allowNull: false },
			endDate: { type: Sequelize.DATEONLY, allowNull: false },
			reason: { type: Sequelize.TEXT, allowNull: true },
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			approvedById: {
				type: Sequelize.UUID,
				allowNull: true,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});

		await queryInterface.createTable("payroll_records", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "users", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			periodStart: { type: Sequelize.DATEONLY, allowNull: false },
			periodEnd: { type: Sequelize.DATEONLY, allowNull: false },
			grossSalary: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
			deductions: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
			netSalary: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
			statusId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: "statuses", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			notes: { type: Sequelize.TEXT, allowNull: true },
			createdAt: { type: Sequelize.DATE, allowNull: false },
			updatedAt: { type: Sequelize.DATE, allowNull: false },
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("payroll_records");
		await queryInterface.dropTable("leaves");
		await queryInterface.dropTable("audit_logs");
		await queryInterface.dropTable("attendance");
		await queryInterface.dropTable("tokens");
		await queryInterface.dropTable("accounts");
		await queryInterface.removeConstraint(
			"departments",
			"departments_managerId_users_fkey",
		);
		await queryInterface.dropTable("users");
		await queryInterface.dropTable("positions");
		await queryInterface.dropTable("departments");
		await queryInterface.dropTable("role_permissions");
		await queryInterface.dropTable("roles");
		await queryInterface.dropTable("employment_types");
		await queryInterface.dropTable("permissions");
		await queryInterface.dropTable("statuses");
	},
};
