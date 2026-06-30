import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";
import {
	computeDurationFromDates,
	parseLeaveRequest,
} from "../utils/leaveDuration";

const leaveIncludes = [
	{ association: "employee", attributes: ["id", "firstName", "lastName", "email"] },
	{ association: "status" },
	{ association: "approvedBy", attributes: ["id", "firstName", "lastName"] },
];

const getLeaveStatus = async (name: string) =>
	database_models.Status.findOne({ where: { name, category: "leave" } });

const assertLeaveAccess = (
	leave: { userId: string },
	viewer: { id: string; permissions: string[] },
) => {
	const canManage = viewer.permissions.includes("leave.manage");
	const isOwn = leave.userId === viewer.id;
	if (!canManage && !isOwn) {
		throwError("FORBIDDEN");
	}
};

export const listLeaves = async (
	query: PaginationQuery,
	viewer: { id: string; permissions: string[] },
) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};

	if (
		!viewer.permissions.includes("leave.manage") &&
		viewer.permissions.includes("leave.read.own")
	) {
		where.userId = viewer.id;
	}

	const { rows, count } = await database_models.Leave.findAndCountAll({
		where,
		include: leaveIncludes,
		limit,
		offset,
		order: [["createdAt", "DESC"]],
	});

	return {
		leaves: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getLeaveById = async (
	id: string,
	viewer: { id: string; permissions: string[] },
) => {
	const leave = await database_models.Leave.findByPk(id, { include: leaveIncludes });
	assertOrThrow(leave, "LEAVE_NOT_FOUND");
	assertLeaveAccess(leave, viewer);
	return leave;
};

export const createLeave = async (
	data: Record<string, unknown>,
	actor: { id: string; permissions: string[] },
) => {
	const parsed = parseLeaveRequest(data);
	const duration = computeDurationFromDates(parsed.startDate, parsed.endDate);
	const pendingStatus = await getLeaveStatus("Pending");

	const leave = await database_models.Leave.create({
		userId: actor.id,
		leaveName: parsed.leaveName,
		leaveType: "other",
		duration,
		durationUnit: "days",
		startDate: parsed.startDate,
		endDate: parsed.endDate,
		reason: parsed.reason ?? null,
		statusId: pendingStatus!.id,
		approvedById: null,
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "leave",
		entityId: leave.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} submitted a leave request.`,
	});

	return getLeaveById(leave.id, {
		id: actor.id,
		permissions: actor.permissions,
	});
};

export const updateLeave = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string; permissions: string[] },
) => {
	const leave = await database_models.Leave.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(leave, "LEAVE_NOT_FOUND");

	const canManage = actor.permissions.includes("leave.manage");
	const isOwn = leave.userId === actor.id;
	if (!canManage && !isOwn) {
		throwError("FORBIDDEN");
	}

	const statusName = (leave as { status?: { name?: string } }).status?.name;
	if (!canManage && statusName !== "Pending") {
		throwError("LEAVE_ACTION_FAILED", "Only pending leave requests can be updated");
	}

	const parsed = parseLeaveRequest(data, {
		leaveName: leave.leaveName,
		startDate: leave.startDate,
		endDate: leave.endDate,
		reason: leave.reason,
	});
	const duration = computeDurationFromDates(parsed.startDate, parsed.endDate);

	const updateData: Record<string, unknown> = {
		leaveName: parsed.leaveName,
		startDate: parsed.startDate,
		endDate: parsed.endDate,
		duration,
		durationUnit: "days",
		reason: parsed.reason ?? null,
	};

	if (canManage && data.statusId !== undefined) {
		updateData.statusId = data.statusId;
	}

	await leave.update(updateData);

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "leave",
		entityId: leave.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated a leave request.`,
	});

	return getLeaveById(id, { id: actor.id, permissions: actor.permissions });
};

export const approveLeave = async (id: string, actor: { id: string }) => {
	const leave = await database_models.Leave.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(leave, "LEAVE_NOT_FOUND");

	const statusName = (leave as { status?: { name?: string } }).status?.name;
	if (statusName !== "Pending") {
		throwError("LEAVE_ACTION_FAILED", "Only pending leave requests can be approved");
	}

	const approvedStatus = await getLeaveStatus("Approved");
	await leave.update({ statusId: approvedStatus!.id, approvedById: actor.id });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "approved",
		entityType: "leave",
		entityId: leave.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} approved a leave request.`,
	});

	return getLeaveById(id, { id: actor.id, permissions: ["leave.manage"] });
};

export const rejectLeave = async (
	id: string,
	actor: { id: string },
	data?: Record<string, unknown>,
) => {
	const leave = await database_models.Leave.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(leave, "LEAVE_NOT_FOUND");

	const statusName = (leave as { status?: { name?: string } }).status?.name;
	if (statusName !== "Pending") {
		throwError("LEAVE_ACTION_FAILED", "Only pending leave requests can be rejected");
	}

	const rejectedStatus = await getLeaveStatus("Rejected");
	await leave.update({
		statusId: rejectedStatus!.id,
		approvedById: actor.id,
		...(data?.reason !== undefined && { reason: data.reason as string }),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "rejected",
		entityType: "leave",
		entityId: leave.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} rejected a leave request.`,
	});

	return getLeaveById(id, { id: actor.id, permissions: ["leave.manage"] });
};

export const cancelLeave = async (
	id: string,
	actor: { id: string; permissions: string[] },
) => {
	const leave = await database_models.Leave.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(leave, "LEAVE_NOT_FOUND");

	const canManage = actor.permissions.includes("leave.manage");
	const isOwn = leave.userId === actor.id;
	if (!canManage && !isOwn) {
		throwError("FORBIDDEN");
	}

	const statusName = (leave as { status?: { name?: string } }).status?.name;
	if (statusName !== "Pending") {
		throwError("LEAVE_ACTION_FAILED", "Only pending leave requests can be cancelled");
	}

	const cancelledStatus = await getLeaveStatus("Cancelled");
	await leave.update({ statusId: cancelledStatus!.id });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "cancelled",
		entityType: "leave",
		entityId: leave.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} cancelled a leave request.`,
	});

	return getLeaveById(id, { id: actor.id, permissions: actor.permissions });
};
