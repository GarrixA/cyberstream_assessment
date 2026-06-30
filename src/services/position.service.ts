import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";

const positionIncludes = [
	{ association: "status" },
	{ association: "department", attributes: ["id", "name"] },
];

export const listPositions = async (query: PaginationQuery) => {
	const { page, limit, offset, sortOrder } = parsePagination(query);
	const where: Record<string, unknown> = {};

	if (query.search) {
		where.title = { [Op.iLike]: `%${query.search}%` };
	}
	if (query.departmentId) {
		where.departmentId = query.departmentId;
	}

	const sortField = query.sortBy === "createdAt" ? "createdAt" : "title";

	const { rows, count } = await database_models.Position.findAndCountAll({
		where,
		include: positionIncludes,
		limit,
		offset,
		order: [[sortField, sortOrder]],
	});

	return {
		positions: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getPositionById = async (id: string) => {
	const position = await database_models.Position.findByPk(id, {
		include: positionIncludes,
	});
	assertOrThrow(position, "POSITION_NOT_FOUND");
	return position;
};

export const createPosition = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "position" },
	});

	const position = await database_models.Position.create({
		title: data.title as string,
		description: (data.description as string) ?? null,
		statusId: activeStatus!.id,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "position",
		entityId: position.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Position ${position.title}.`,
	});

	return getPositionById(position.id);
};

export const updatePosition = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const position = await database_models.Position.findByPk(id);
	assertOrThrow(position, "POSITION_NOT_FOUND");

	await position.update({
		...(data.title !== undefined && { title: data.title as string }),
		...(data.description !== undefined && {
			description: data.description as string | null,
		}),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "position",
		entityId: position.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Position ${position.title}.`,
	});

	return getPositionById(id);
};

export const assignPositionDepartment = async (
	id: string,
	departmentId: string,
	actor: { id: string },
) => {
	const position = await database_models.Position.findByPk(id);
	assertOrThrow(position, "POSITION_NOT_FOUND");

	const department = await database_models.Department.findByPk(departmentId);
	assertOrThrow(department, "DEPARTMENT_NOT_FOUND");

	await position.update({ departmentId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "position",
		entityId: position.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned Department ${department.name} to Position ${position.title}.`,
	});

	return getPositionById(id);
};

export const assignPositionStatus = async (
	id: string,
	statusId: string,
	actor: { id: string; roleName?: string },
) => {
	const position = await database_models.Position.findByPk(id);
	assertOrThrow(position, "POSITION_NOT_FOUND");

	const status = await database_models.Status.findByPk(statusId);
	assertOrThrow(status, "STATUS_NOT_FOUND");

	if (status.category !== "position") {
		throwError("POSITION_INVALID_STATUS");
	}

	if (status.name === "Inactive" && actor.roleName !== "Admin") {
		throwError("POSITION_INACTIVE_STATUS_ADMIN_ONLY");
	}

	await position.update({ statusId });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "position",
		entityId: position.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} assigned status ${status.name} to Position ${position.title}.`,
	});

	return getPositionById(id);
};

export const deactivatePosition = async (
	id: string,
	actor: { id: string },
) => {
	const position = await database_models.Position.findByPk(id);
	assertOrThrow(position, "POSITION_NOT_FOUND");

	const inactiveStatus = await database_models.Status.findOne({
		where: { name: "Inactive", category: "position" },
	});

	await position.update({ statusId: inactiveStatus!.id });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deactivated",
		entityType: "position",
		entityId: position.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deactivated Position ${position.title}.`,
	});

	return getPositionById(id);
};
