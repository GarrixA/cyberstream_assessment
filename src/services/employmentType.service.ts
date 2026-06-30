import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";

export const listEmploymentTypes = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};

	if (query.search) {
		where[Op.or as unknown as string] = [
			{ name: { [Op.iLike]: `%${query.search}%` } },
			{ description: { [Op.iLike]: `%${query.search}%` } },
		];
	}

	const { rows, count } = await database_models.EmploymentType.findAndCountAll({
		where,
		limit,
		offset,
		order: [["name", "ASC"]],
	});

	return {
		employmentTypes: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getEmploymentTypeById = async (id: string) => {
	const employmentType = await database_models.EmploymentType.findByPk(id);
	assertOrThrow(employmentType, "EMPLOYMENT_TYPE_NOT_FOUND");
	return employmentType;
};

export const createEmploymentType = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const employmentType = await database_models.EmploymentType.create({
		name: data.name as string,
		description: (data.description as string) ?? null,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "employment_type",
		entityId: employmentType.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created Employment Type ${employmentType.name}.`,
	});

	return getEmploymentTypeById(employmentType.id);
};

export const updateEmploymentType = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const employmentType = await database_models.EmploymentType.findByPk(id);
	assertOrThrow(employmentType, "EMPLOYMENT_TYPE_NOT_FOUND");

	await employmentType.update({
		...(data.name !== undefined && { name: data.name as string }),
		...(data.description !== undefined && {
			description: data.description as string | null,
		}),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "employment_type",
		entityId: employmentType.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated Employment Type ${employmentType.name}.`,
	});

	return getEmploymentTypeById(id);
};

export const deleteEmploymentType = async (
	id: string,
	actor: { id: string },
) => {
	const employmentType = await database_models.EmploymentType.findByPk(id);
	assertOrThrow(employmentType, "EMPLOYMENT_TYPE_NOT_FOUND");

	const employeeCount = await database_models.User.count({
		where: { employmentTypeId: id },
	});
	if (employeeCount > 0) {
		throwError("EMPLOYMENT_TYPE_IN_USE");
	}

	const employmentTypeName = employmentType.name;
	await employmentType.destroy();

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deleted",
		entityType: "employment_type",
		entityId: id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deleted Employment Type ${employmentTypeName}.`,
	});
};
