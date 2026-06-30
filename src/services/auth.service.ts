import { randomUUID } from "crypto";
import { Model, Op } from "sequelize";
import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { comparePassword, hashPassword } from "../utils/password";
import { signAccessToken, signResetToken, verifyToken } from "../utils/token";
import { generateResetCode } from "../utils/reset-code";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { buildEmployeeSearchWhere } from "../utils/query";
import {
	sendPasswordResetConfirmationEmail,
	sendPasswordResetEmail,
} from "../utils/email.service";

const userIncludes = [
	{ association: "role", attributes: ["id", "name"] },
	{ association: "status", attributes: ["id", "name", "category"] },
	{ association: "department", attributes: ["id", "name"] },
	{ association: "position", attributes: ["id", "title"] },
];

const managerIncludes = [
	{ association: "role", attributes: ["id", "name"] },
	{ association: "status", attributes: ["id", "name"] },
	{ association: "department", attributes: ["id", "name"] },
	{ association: "position", attributes: ["id", "title"] },
];

const sanitizeUser = (user: Model | Record<string, unknown>) => {
	const data =
		"get" in user && typeof user.get === "function"
			? (user as Model).get({ plain: true })
			: { ...user };
	delete data.password;
	return data;
};

const invalidateUserAccessTokens = async (userId: string) => {
	const invalidatedStatus = await database_models.Status.findOne({
		where: { name: "Invalidated", category: "token" },
	});

	await database_models.Token.update(
		{
			statusId: invalidatedStatus!.id,
			invalidatedAt: new Date(),
		},
		{
			where: {
				userId,
				type: "access",
				invalidatedAt: { [Op.is]: null },
			},
		},
	);
};

const getUserPermissions = async (roleId: string) => {
	const role = await database_models.Role.findByPk(roleId, {
		include: [{ model: database_models.Permission, as: "permissions" }],
	});
	return (
		(role?.get("permissions") as Array<{ code: string }> | undefined)?.map(
			(p) => p.code,
		) ?? []
	);
};

export const login = async (params: {
	email: string;
	password: string;
	ipAddress?: string;
	deviceInfo?: string;
}) => {
	const user = await database_models.User.findOne({
		where: { email: params.email },
		include: [{ association: "role" }, { association: "status" }],
	});

	assertOrThrow(user, "INVALID_CREDENTIALS");

	const status = user.get("status") as { name?: string };
	if (status?.name !== "Active") {
		throwError("ACCOUNT_INACTIVE");
	}

	const valid = await comparePassword(params.password, user.password);
	if (!valid) throwError("INVALID_CREDENTIALS");

	const role = user.get("role") as { id: string; name: string };
	const permissions = await getUserPermissions(role.id);

	const tokenPayload = {
		id: user.id,
		email: user.email,
		roleId: role.id,
		roleName: role.name,
		permissions,
		jti: randomUUID(),
	};

	const accessToken = signAccessToken(tokenPayload);
	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "token" },
	});

	await database_models.Token.create({
		userId: user.id,
		token: accessToken,
		type: "access",
		statusId: activeStatus!.id,
		expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
	});

	const attendance = await database_models.Attendance.create({
		userId: user.id,
		loginAt: new Date(),
		ipAddress: params.ipAddress ?? null,
		deviceInfo: params.deviceInfo ?? null,
	});

	await createAuditLog({
		actorId: user.id,
		action: "logged_in",
		entityType: "session",
		entityId: user.id,
		description: `${formatActorName(user.firstName, user.lastName)} logged in.`,
		metadata: {
			attendanceId: attendance.id,
			...(params.ipAddress && { ipAddress: params.ipAddress }),
			...(params.deviceInfo && { deviceInfo: params.deviceInfo }),
		},
	});

	return {
		token: accessToken,
		user: {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: role.name,
			permissions,
		},
		attendanceId: attendance.id,
	};
};

export const logout = async (params: { userId: string; token: string }) => {
	const tokenRecord = await database_models.Token.findOne({
		where: { token: params.token, userId: params.userId, type: "access" },
		include: [{ association: "status" }],
	});

	assertOrThrow(tokenRecord, "UNAUTHORIZED");

	const status = tokenRecord.get("status") as { name?: string } | undefined;
	if (tokenRecord.invalidatedAt || status?.name === "Invalidated") {
		throwError("SESSION_EXPIRED");
	}

	const invalidatedStatus = await database_models.Status.findOne({
		where: { name: "Invalidated", category: "token" },
	});

	await tokenRecord.update({
		statusId: invalidatedStatus!.id,
		invalidatedAt: new Date(),
	});

	const openAttendance = await database_models.Attendance.findOne({
		where: { userId: params.userId, logoutAt: { [Op.is]: null } },
		order: [["loginAt", "DESC"]],
	});

	if (openAttendance) {
		await openAttendance.update({ logoutAt: new Date() });
	}

	const user = await database_models.User.findByPk(params.userId);
	await createAuditLog({
		actorId: params.userId,
		action: "logged_out",
		entityType: "session",
		entityId: params.userId,
		description: `${formatActorName(user?.firstName, user?.lastName)} logged out.`,
		metadata: openAttendance ? { attendanceId: openAttendance.id } : undefined,
	});
};

const assertPasswordsMatch = (
	newPassword: string,
	confirmNewPassword: string,
) => {
	if (newPassword !== confirmNewPassword) {
		throwError("PASSWORDS_DO_NOT_MATCH");
	}
};

const getValidResetRecord = async (code: string) => {
	const tokenRecord = await database_models.Token.findOne({
		where: {
			token: code,
			type: "reset_password",
		},
		include: [{ association: "status" }],
	});

	const isInvalidCode =
		!tokenRecord ||
		tokenRecord.invalidatedAt ||
		(tokenRecord.expiresAt && tokenRecord.expiresAt < new Date());

	if (isInvalidCode) throwError("INVALID_RESET_TOKEN");
	assertOrThrow(tokenRecord, "INVALID_RESET_TOKEN");

	return tokenRecord;
};

const resolveResetCode = (params: { token?: string; code?: string }): string => {
	if (params.code) {
		return params.code;
	}

	if (params.token) {
		try {
			const payload = verifyToken(params.token) as { code?: string };
			if (!payload.code) {
				throwError("INVALID_RESET_TOKEN");
			}
			return payload.code as string;
		} catch {
			throwError("INVALID_RESET_TOKEN");
		}
	}

	throwError("INVALID_RESET_TOKEN");
	return "";
};

export const verifyResetPassword = async (params: {
	token?: string;
	code?: string;
}) => {
	const code = resolveResetCode(params);
	const tokenRecord = await getValidResetRecord(code);
	const user = await database_models.User.findByPk(tokenRecord.userId);
	assertOrThrow(user, "USER_NOT_FOUND");

	return {
		code,
		email: user.email,
		expiresAt: tokenRecord.expiresAt,
	};
};

export const forgotPassword = async (email: string) => {
	const user = await database_models.User.findOne({ where: { email } });
	if (!user) return { resetCode: null };

	const resetCode = generateResetCode();
	const resetToken = signResetToken({
		id: user.id,
		email: user.email,
		code: resetCode,
	});
	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "token" },
	});
	const invalidatedStatus = await database_models.Status.findOne({
		where: { name: "Invalidated", category: "token" },
	});

	await database_models.Token.update(
		{
			statusId: invalidatedStatus!.id,
			invalidatedAt: new Date(),
		},
		{
			where: {
				userId: user.id,
				type: "reset_password",
				invalidatedAt: { [Op.is]: null },
			},
		},
	);

	await database_models.Token.create({
		userId: user.id,
		token: resetCode,
		type: "reset_password",
		statusId: activeStatus!.id,
		expiresAt: new Date(Date.now() + 15 * 60 * 1000),
	});

	try {
		await sendPasswordResetEmail({
			email: user.email,
			firstName: user.firstName,
			resetCode,
			resetToken,
		});
	} catch (error) {
		console.error(
			`[email] Password reset email failed for ${user.email}:`,
			(error as Error).message,
		);
	}

	return { resetCode, resetToken, email: user.email };
};

export const resetPassword = async (params: {
	code: string;
	newPassword: string;
	confirmNewPassword: string;
}) => {
	assertPasswordsMatch(params.newPassword, params.confirmNewPassword);

	const tokenRecord = await getValidResetRecord(params.code);
	const user = await database_models.User.findByPk(tokenRecord.userId);
	assertOrThrow(user, "USER_NOT_FOUND");

	const hashed = await hashPassword(params.newPassword);
	await user.update({ password: hashed, lastPasswordChanged: new Date() });

	const invalidatedStatus = await database_models.Status.findOne({
		where: { name: "Invalidated", category: "token" },
	});

	await tokenRecord.update({
		statusId: invalidatedStatus!.id,
		invalidatedAt: new Date(),
	});

	try {
		await sendPasswordResetConfirmationEmail({
			email: user.email,
			firstName: user.firstName,
		});
	} catch (error) {
		console.error(
			`[email] Password reset confirmation failed for ${user.email}:`,
			(error as Error).message,
		);
	}
};

export const changePassword = async (params: {
	userId: string;
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}) => {
	assertPasswordsMatch(params.newPassword, params.confirmNewPassword);

	const user = await database_models.User.findByPk(params.userId);
	assertOrThrow(user, "USER_NOT_FOUND");

	const valid = await comparePassword(params.currentPassword, user.password);
	if (!valid) throwError("INVALID_PASSWORD");

	const hashed = await hashPassword(params.newPassword);
	await user.update({ password: hashed, lastPasswordChanged: new Date() });

	await createAuditLog({
		actorId: params.userId,
		action: "updated",
		entityType: "user",
		entityId: params.userId,
		description: `${formatActorName(user.firstName, user.lastName)} changed their password.`,
	});
};

export const listUsers = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where = buildEmployeeSearchWhere(query);

	const { rows, count } = await database_models.User.findAndCountAll({
		where,
		include: userIncludes,
		limit,
		offset,
		order: [["createdAt", "DESC"]],
		distinct: true,
		subQuery: false,
	});

	return {
		users: rows.map(sanitizeUser),
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const listManagers = async (query: PaginationQuery) => {
	const managerRole = await database_models.Role.findOne({
		where: { name: "Manager" },
	});
	assertOrThrow(managerRole, "ROLE_NOT_FOUND");

	const { page, limit, offset } = parsePagination(query);
	const where = buildEmployeeSearchWhere(query);
	where.roleId = managerRole.id;

	if (!query.statusId) {
		const activeStatus = await database_models.Status.findOne({
			where: { name: "Active", category: "user" },
		});
		where.statusId = activeStatus!.id;
	}

	const { rows, count } = await database_models.User.findAndCountAll({
		where,
		include: managerIncludes,
		limit,
		offset,
		order: [
			["firstName", "ASC"],
			["lastName", "ASC"],
		],
		distinct: true,
		subQuery: false,
	});

	return {
		managers: rows.map(sanitizeUser),
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const activateUser = async (
	id: string,
	actor: { id: string },
) => {
	const user = await database_models.User.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(user, "USER_NOT_FOUND");

	const status = user.get("status") as { name?: string };
	if (status?.name === "Active") {
		throwError("USER_ALREADY_ACTIVE");
	}

	const activeStatus = await database_models.Status.findOne({
		where: { name: "Active", category: "user" },
	});

	await user.update({ statusId: activeStatus!.id });

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "activated",
		entityType: "user",
		entityId: user.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} activated User ${user.firstName} ${user.lastName}.`,
	});

	const updatedUser = await database_models.User.findByPk(id, {
		include: userIncludes,
	});
	return sanitizeUser(updatedUser!);
};

export const deactivateUser = async (
	id: string,
	actor: { id: string },
) => {
	if (id === actor.id) {
		throwError("CANNOT_DEACTIVATE_SELF");
	}

	const user = await database_models.User.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(user, "USER_NOT_FOUND");

	const status = user.get("status") as { name?: string };
	if (status?.name === "Inactive") {
		throwError("USER_ALREADY_INACTIVE");
	}

	const inactiveStatus = await database_models.Status.findOne({
		where: { name: "Inactive", category: "user" },
	});

	await user.update({ statusId: inactiveStatus!.id });
	await invalidateUserAccessTokens(user.id);

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deactivated",
		entityType: "user",
		entityId: user.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deactivated User ${user.firstName} ${user.lastName}.`,
	});

	const updatedUser = await database_models.User.findByPk(id, {
		include: userIncludes,
	});
	return sanitizeUser(updatedUser!);
};
