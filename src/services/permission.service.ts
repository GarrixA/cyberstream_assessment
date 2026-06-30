import { Op, QueryTypes } from "sequelize";
import database_models, { sequelizeConnection } from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";

const countPermissionRoleAssignments = async (permissionId: string) => {
	const [result] = await sequelizeConnection.query<{ count: number }>(
		`SELECT COUNT(*)::int AS count FROM role_permissions WHERE "permissionId" = :permissionId`,
		{
			replacements: { permissionId },
			type: QueryTypes.SELECT,
		},
	);

	return result?.count ?? 0;
};

export const listPermissions = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};

	if (query.search) {
		where[Op.or as unknown as string] = [
			{ name: { [Op.iLike]: `%${query.search}%` } },
			{ code: { [Op.iLike]: `%${query.search}%` } },
			{ description: { [Op.iLike]: `%${query.search}%` } },
		];
	}

	const { rows, count } = await database_models.Permission.findAndCountAll({
		where,
		limit,
		offset,
		order: [["code", "ASC"]],
	});

	return {
		permissions: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getPermissionById = async (id: string) => {
	const permission = await database_models.Permission.findByPk(id);
	assertOrThrow(permission, "PERMISSION_NOT_FOUND");
	return permission;
};

export const createPermission = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const permission = await database_models.Permission.create({
		code: data.code as string,
		name: data.name as string,
		description: (data.description as string) ?? null,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "permission",
		entityId: permission.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Permission ${permission.code}.`,
	});

	return getPermissionById(permission.id);
};

export const updatePermission = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const permission = await database_models.Permission.findByPk(id);
	assertOrThrow(permission, "PERMISSION_NOT_FOUND");

	await permission.update({
		...(data.code !== undefined && { code: data.code as string }),
		...(data.name !== undefined && { name: data.name as string }),
		...(data.description !== undefined && {
			description: data.description as string | null,
		}),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "permission",
		entityId: permission.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Permission ${permission.code}.`,
	});

	return getPermissionById(id);
};

export const deletePermission = async (id: string, actor: { id: string }) => {
	const permission = await database_models.Permission.findByPk(id);
	assertOrThrow(permission, "PERMISSION_NOT_FOUND");

	const assignments = await countPermissionRoleAssignments(id);
	if (assignments > 0) {
		throwError("PERMISSION_IN_USE");
	}

	const permissionCode = permission.code;
	await permission.destroy();

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deleted",
		entityType: "permission",
		entityId: id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deleted Permission ${permissionCode}.`,
	});
};
