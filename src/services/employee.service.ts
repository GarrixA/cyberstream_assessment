import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { generateEmployeeCode } from "../utils/employee-code";
import { generatePassword, hashPassword } from "../utils/password";
import { parseAttendanceDateRange } from "../utils/dateRange";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import {
	buildEmployeeSearchWhere,
	getEmployeeSortField,
} from "../utils/query";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";
import { sendEmployeeWelcomeEmail } from "../utils/email.service";
import { DEV_MODE } from "../utils/keys";
import { employeeIncludes, employeeDetailIncludes, sanitizeEmployee } from "./employee.helpers";

const adminViewer = (actorId: string) => ({
	id: actorId,
	permissions: ["employee.read.all", "salary.view"],
});

export const listEmployees = async (
	query: PaginationQuery,
	viewer: { id: string; permissions: string[] },
) => {
	const { page, limit, offset, sortOrder } = parsePagination(query);
	const where = buildEmployeeSearchWhere(query);
	const canViewSalary = viewer.permissions.includes("salary.view");

	if (
		!viewer.permissions.includes("employee.read.all") &&
		viewer.permissions.includes("employee.read.team")
	) {
		where.managerId = viewer.id;
	} else if (
		!viewer.permissions.includes("employee.read.all") &&
		!viewer.permissions.includes("employee.read.team") &&
		viewer.permissions.includes("employee.read.own")
	) {
		where.id = viewer.id;
	}

	const { rows, count } = await database_models.User.findAndCountAll({
		where,
		include: employeeIncludes,
		limit,
		offset,
		order: [[getEmployeeSortField(query.sortBy), sortOrder]],
		distinct: true,
		subQuery: false,
	});

	return {
		employees: rows.map((e) => sanitizeEmployee(e, canViewSalary)),
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getEmployeeById = async (
	id: string,
	viewer: { id: string; permissions: string[] },
) => {
	const canViewAll = viewer.permissions.includes("employee.read.all");
	const canViewTeam = viewer.permissions.includes("employee.read.team");
	const canViewOwn = viewer.permissions.includes("employee.read.own");
	const canViewSalary = viewer.permissions.includes("salary.view");

	if (!canViewAll && !canViewTeam && !(canViewOwn && id === viewer.id)) {
		if (canViewTeam) {
			const target = await database_models.User.findByPk(id);
			if (!target || target.managerId !== viewer.id) {
				throwError("FORBIDDEN");
			}
		} else if (id !== viewer.id) {
			throwError("FORBIDDEN");
		}
	}

	const employee = await database_models.User.findByPk(id, {
		include: employeeDetailIncludes,
	});

	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");
	return sanitizeEmployee(employee, canViewSalary);
};

export const createEmployee = async (
	data: Record<string, unknown>,
	actor: { id: string; firstName?: string; lastName?: string },
) => {
	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "user" },
	});

	const plainPassword = generatePassword();
	const password = await hashPassword(plainPassword);
	const employeeCode = await generateEmployeeCode();

	const employee = await database_models.User.create({
		employeeCode,
		firstName: data.firstName as string,
		lastName: data.lastName as string,
		email: data.email as string,
		phone: (data.phone as string) ?? null,
		password,
		roleId: null,
		salary: (data.salary as number) ?? null,
		statusId: activeStatus!.id,
		profilePicture: (data.profilePicture as string) ?? null,
		address: (data.address as string) ?? null,
		emergencyContactName: (data.emergencyContactName as string) ?? null,
		emergencyContactPhone: (data.emergencyContactPhone as string) ?? null,
		emergencyContactRelation: (data.emergencyContactRelation as string) ?? null,
		dateJoined: (data.dateJoined as string) || new Date().toISOString().slice(0, 10),
		lastPasswordChanged: new Date(),
	});

	if (
		data.bankName &&
		data.accountNumber != null &&
		data.accountName
	) {
		const accountActive = await database_models.Status.findOne({
			where: { name: "Active", category: "account" },
		});
		await database_models.Account.create({
			userId: employee.id,
			bankName: data.bankName as string,
			accountNumber: data.accountNumber as number,
			accountName: data.accountName as string,
			statusId: accountActive!.id,
		});
	}

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Employee ${employee.firstName}.`,
		metadata: { employeeCode: employee.employeeCode },
	});

	const createdEmployee = await getEmployeeById(employee.id, adminViewer(actor.id));

	try {
		await sendEmployeeWelcomeEmail({
			email: employee.email,
			firstName: employee.firstName,
			lastName: employee.lastName,
			employeeCode: employee.employeeCode,
			temporaryPassword: plainPassword,
		});
	} catch (error) {
		console.error(
			`[email] Welcome email failed for ${employee.email}:`,
			(error as Error).message,
		);
	}

	return DEV_MODE === "development"
		? { ...createdEmployee, temporaryPassword: plainPassword }
		: createdEmployee;
};

export const updateEmployee = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string; permissions: string[] },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const isLimited = actor.permissions.includes("employee.update.limited");
	const isOwn = actor.id === id && actor.permissions.includes("employee.update.own");
	const isFull = actor.permissions.includes("employee.update");

	if (!isFull && !isLimited && !isOwn) throwError("FORBIDDEN");

	const allowedOwnFields = [
		"profilePicture",
		"phone",
		"address",
		"emergencyContactName",
		"emergencyContactPhone",
		"emergencyContactRelation",
	];

	const allowedLimitedFields = [...allowedOwnFields, "phone"];

	let updateData: Record<string, unknown> = {};
	if (isOwn && !isFull && !isLimited) {
		for (const field of allowedOwnFields) {
			if (data[field] !== undefined) updateData[field] = data[field];
		}
	} else if (isLimited && !isFull) {
		for (const field of allowedLimitedFields) {
			if (data[field] !== undefined) updateData[field] = data[field];
		}
	} else {
		const restricted = [
			"password",
			"positionId",
			"departmentId",
			"roleId",
			"managerId",
			"employmentTypeId",
			"statusId",
		];
		updateData = Object.fromEntries(
			Object.entries(data).filter(([key]) => !restricted.includes(key)),
		);
	}

	if (
		data.salary !== undefined &&
		!actor.permissions.includes("salary.view")
	) {
		delete updateData.salary;
	}

	await employee.update(updateData);

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Employee ${employee.firstName}.`,
		metadata: { fields: Object.keys(updateData) },
	});

	return getEmployeeById(id, actor);
};

export const deactivateEmployee = async (
	id: string,
	actor: { id: string },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const inactiveStatus = await database_models.Status.findOne({
		where: { name: "Inactive", category: "user" },
	});

	await employee.update({ statusId: inactiveStatus!.id });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deactivated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deactivated Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const assignEmployeeRole = async (
	id: string,
	roleId: string,
	actor: { id: string; permissions: string[] },
) => {
	if (!actor.permissions.includes("role.manage")) {
		throwError("FORBIDDEN");
	}

	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const role = await database_models.Role.findByPk(roleId);
	assertOrThrow(role, "ROLE_NOT_FOUND");

	await employee.update({ roleId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned Role ${role.name} to Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const assignEmployeeDepartment = async (
	id: string,
	departmentId: string,
	actor: { id: string },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const department = await database_models.Department.findByPk(departmentId);
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");

	await employee.update({ departmentId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned Department ${department.name} to Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const assignEmployeePosition = async (
	id: string,
	positionId: string,
	actor: { id: string },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const position = await database_models.Position.findByPk(positionId);
	assertOrThrow(position, "POSITION_NOT_FOUND");

	await employee.update({ positionId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned Position ${position.title} to Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const assignEmployeeManager = async (
	id: string,
	managerId: string,
	actor: { id: string },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const manager = await database_models.User.findByPk(managerId);
	assertOrThrow(manager, "EMPLOYEE_NOT_FOUND");

	await employee.update({ managerId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned ${formatActorName(manager.firstName, manager.lastName)} as manager of Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const assignEmployeeEmploymentType = async (
	id: string,
	employmentTypeId: string,
	actor: { id: string },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const employmentType =
		await database_models.EmploymentType.findByPk(employmentTypeId);
	assertOrThrow(employmentType, "EMPLOYMENT_TYPE_NOT_FOUND");

	await employee.update({ employmentTypeId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned Employment Type ${employmentType.name} to Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const assignEmployeeStatus = async (
	id: string,
	statusId: string,
	actor: { id: string },
) => {
	const employee = await database_models.User.findByPk(id);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	const status = await database_models.Status.findByPk(statusId);
	assertOrThrow(status, "STATUS_NOT_FOUND");

	if (status.category !== "user") {
		throwError("EMPLOYEE_INVALID_STATUS");
	}

	if (status.name === "Inactive") {
		throwError("EMPLOYEE_INACTIVE_STATUS_ADMIN_ONLY");
	}

	await employee.update({ statusId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employee",
		entityId: employee.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned status ${status.name} to Employee ${employee.firstName}.`,
	});

	return getEmployeeById(id, adminViewer(actor.id));
};

export const listAuditLogs = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};
	if (query.search) {
		where.description = { [Op.iLike]: `%${query.search}%` };
	}

	const { rows, count } = await database_models.AuditLog.findAndCountAll({
		where,
		include: [
			{
				association: "actor",
				attributes: ["id", "firstName", "lastName", "email"],
			},
		],
		limit,
		offset,
		order: [["createdAt", "DESC"]],
	});

	return {
		logs: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const listAttendance = async (
	query: PaginationQuery,
	viewer: { id: string; permissions: string[] },
) => {
	const { page, limit, offset } = parsePagination(query);
	const { startDate, endDate, rangeStart, rangeEndExclusive } =
		parseAttendanceDateRange(query);
	const where: Record<string, unknown> = {
		loginAt: {
			[Op.gte]: rangeStart,
			[Op.lt]: rangeEndExclusive,
		},
	};

	if (
		!viewer.permissions.includes("attendance.read.all") &&
		viewer.permissions.includes("attendance.read.own")
	) {
		where.userId = viewer.id;
	} else if (query.search) {
		// search by user id if provided as uuid
		where.userId = query.search;
	}

	const { rows, count } = await database_models.Attendance.findAndCountAll({
		where,
		include: [
			{
				association: "user",
				attributes: ["id", "firstName", "lastName", "email", "employeeCode"],
			},
		],
		limit,
		offset,
		order: [["loginAt", "DESC"]],
	});

	return {
		attendance: rows,
		dateRange: { startDate, endDate },
		pagination: buildPaginationMeta(count, page, limit),
	};
};
