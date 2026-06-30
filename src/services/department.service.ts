import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";

const departmentIncludes = [
	{ association: "status" },
	{
		association: "manager",
		attributes: ["id", "firstName", "lastName", "email"],
	},
];

export const listDepartments = async (query: PaginationQuery) => {
	const { page, limit, offset, sortOrder } = parsePagination(query);
	const where: Record<string, unknown> = {};
	if (query.search) {
		where.name = { [Op.iLike]: `%${query.search}%` };
	}

	const sortField = query.sortBy === "createdAt" ? "createdAt" : "name";

	const { rows, count } = await database_models.Department.findAndCountAll({
		where,
		include: departmentIncludes,
		limit,
		offset,
		order: [[sortField, sortOrder]],
	});

	return {
		departments: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getDepartmentById = async (id: string) => {
	const department = await database_models.Department.findByPk(id, {
		include: departmentIncludes,
	});
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");
	return department;
};

export const createDepartment = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "department" },
	});

	const department = await database_models.Department.create({
		name: data.name as string,
		description: (data.description as string) ?? null,
		statusId: activeStatus!.id,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "department",
		entityId: department.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Department ${department.name}.`,
	});

	return getDepartmentById(department.id);
};

export const updateDepartment = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const department = await database_models.Department.findByPk(id);
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");

	await department.update({
		...(data.name !== undefined && { name: data.name as string }),
		...(data.description !== undefined && {
			description: data.description as string | null,
		}),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "department",
		entityId: department.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Department ${department.name}.`,
	});

	return getDepartmentById(id);
};

export const assignDepartmentManager = async (
	id: string,
	managerId: string,
	actor: { id: string },
) => {
	const department = await database_models.Department.findByPk(id);
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");

	const manager = await database_models.User.findByPk(managerId);
	assertOrThrow(manager, "USER_NOT_FOUND");

	await department.update({ managerId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "department",
		entityId: department.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned ${formatActorName(manager.firstName, manager.lastName)} as manager of Department ${department.name}.`,
	});

	return getDepartmentById(id);
};

export const assignDepartmentStatus = async (
	id: string,
	statusId: string,
	actor: { id: string; roleName?: string },
) => {
	const department = await database_models.Department.findByPk(id);
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");

	const status = await database_models.Status.findByPk(statusId);
	assertOrThrow(status, "STATUS_NOT_FOUND");

	if (status.category !== "department") {
		throwError("DEPARTMENT_INVALID_STATUS");
	}

	if (status.name === "Inactive" && actor.roleName !== "Admin") {
		throwError("DEPARTMENT_INACTIVE_STATUS_ADMIN_ONLY");
	}

	await department.update({ statusId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "department",
		entityId: department.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned status ${status.name} to Department ${department.name}.`,
	});

	return getDepartmentById(id);
};

export const deactivateDepartment = async (
	id: string,
	actor: { id: string },
) => {
	const department = await database_models.Department.findByPk(id);
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");

	const inactiveStatus = await database_models.Status.findOne({
		where: { name: "Inactive", category: "department" },
	});

	await department.update({ statusId: inactiveStatus!.id });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deactivated",
		entityType: "department",
		entityId: department.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deactivated Department ${department.name}.`,
	});

	return getDepartmentById(id);
};
