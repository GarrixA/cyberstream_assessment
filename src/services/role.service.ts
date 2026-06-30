import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";

const roleIncludes = [
	{ association: "status" },
	{ association: "permissions" },
];

export const listRoles = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};
	if (query.search) {
		where.name = { [Op.iLike]: `%${query.search}%` };
	}

	const { rows, count } = await database_models.Role.findAndCountAll({
		where,
		include: roleIncludes,
		limit,
		offset,
		order: [["name", "ASC"]],
	});

	return {
		roles: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getRoleById = async (id: string) => {
	const role = await database_models.Role.findByPk(id, { include: roleIncludes });
	assertOrThrow(role, "ROLE_NOT_FOUND");
	return role;
};

export const createRole = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "role" },
	});

	const role = await database_models.Role.create({
		name: data.name as string,
		description: (data.description as string) ?? null,
		statusId: activeStatus!.id,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "role",
		entityId: role.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Role ${role.name}.`,
	});

	return getRoleById(role.id);
};

export const updateRole = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const role = await database_models.Role.findByPk(id);
	assertOrThrow(role, "ROLE_NOT_FOUND");

	await role.update({
		...(data.name !== undefined && { name: data.name as string }),
		...(data.description !== undefined && {
			description: data.description as string | null,
		}),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "role",
		entityId: role.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Role ${role.name}.`,
	});

	return getRoleById(id);
};

export const assignRolePermissions = async (
	id: string,
	permissionIds: string[],
	actor: { id: string },
) => {
	const role = await database_models.Role.findByPk(id);
	assertOrThrow(role, "ROLE_NOT_FOUND");

	if (permissionIds.length > 0) {
		const permissions = await database_models.Permission.findAll({
			where: { id: permissionIds },
		});

		if (permissions.length !== permissionIds.length) {
			throwError("PERMISSION_NOT_FOUND");
		}
	}

	await role.setPermissions(permissionIds);

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "role",
		entityId: role.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned permissions to Role ${role.name}.`,
	});

	return getRoleById(id);
};

export const assignRoleStatus = async (
	id: string,
	statusId: string,
	actor: { id: string },
) => {
	const role = await database_models.Role.findByPk(id);
	assertOrThrow(role, "ROLE_NOT_FOUND");

	const status = await database_models.Status.findByPk(statusId);
	assertOrThrow(status, "STATUS_NOT_FOUND");

	if (status.category !== "role") {
		throwError("ROLE_INVALID_STATUS");
	}

	await role.update({ statusId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "role",
		entityId: role.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned status ${status.name} to Role ${role.name}.`,
	});

	return getRoleById(id);
};

export const deleteRole = async (id: string, actor: { id: string }) => {
	const role = await database_models.Role.findByPk(id);
	assertOrThrow(role, "ROLE_NOT_FOUND");

	const assignedCount = await database_models.User.count({ where: { roleId: id } });
	if (assignedCount > 0) {
		throwError("ROLE_IN_USE");
	}

	const roleName = role.name;
	await role.destroy();

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deleted",
		entityType: "role",
		entityId: id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deleted Role ${roleName}.`,
	});
};
