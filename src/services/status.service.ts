import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { Status } from "../database/models/status";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";

const countStatusReferences = async (statusId: string) => {
	const counts = await Promise.all([
		database_models.User.count({ where: { statusId } }),
		database_models.Role.count({ where: { statusId } }),
		database_models.Department.count({ where: { statusId } }),
		database_models.Account.count({ where: { statusId } }),
		database_models.Position.count({ where: { statusId } }),
		database_models.Token.count({ where: { statusId } }),
		database_models.Leave.count({ where: { statusId } }),
		database_models.PayrollRecord.count({ where: { statusId } }),
	]);

	return counts.reduce((total, count) => total + count, 0);
};

export const listStatuses = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};

	if (query.category) {
		where.category = query.category;
	}
	if (query.search) {
		where[Op.or as unknown as string] = [
			{ name: { [Op.iLike]: `%${query.search}%` } },
			{ description: { [Op.iLike]: `%${query.search}%` } },
		];
	}

	const { rows, count } = await database_models.Status.findAndCountAll({
		where,
		limit,
		offset,
		order: [
			["category", "ASC"],
			["name", "ASC"],
		],
	});

	return {
		statuses: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getStatusById = async (id: string) => {
	const status = await database_models.Status.findByPk(id);
	assertOrThrow(status, "STATUS_NOT_FOUND");
	return status;
};

export const createStatus = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const status = await database_models.Status.create({
		name: data.name as string,
		category: data.category as Status["category"],
		description: (data.description as string) ?? null,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "status",
		entityId: status.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Status ${status.name} (${status.category}).`,
	});

	return getStatusById(status.id);
};

export const updateStatus = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const status = await database_models.Status.findByPk(id);
	assertOrThrow(status, "STATUS_NOT_FOUND");

	await status.update({
		...(data.name !== undefined && { name: data.name as string }),
		...(data.category !== undefined && {
			category: data.category as Status["category"],
		}),
		...(data.description !== undefined && {
			description: data.description as string | null,
		}),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "status",
		entityId: status.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Status ${status.name}.`,
	});

	return getStatusById(id);
};

export const deleteStatus = async (id: string, actor: { id: string }) => {
	const status = await database_models.Status.findByPk(id);
	assertOrThrow(status, "STATUS_NOT_FOUND");

	const references = await countStatusReferences(id);
	if (references > 0) {
		throwError("STATUS_IN_USE");
	}

	const statusLabel = `${status.name} (${status.category})`;
	await status.destroy();

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deleted",
		entityType: "status",
		entityId: id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deleted Status ${statusLabel}.`,
	});
};
