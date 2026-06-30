import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../utils/keys";
import database_models from "../database/config/db.config";
import { AuthRequest, AuthUserPayload } from "../types/express";
import { sendAppError } from "../utils/errors";

export const authenticate = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return sendAppError(res, "UNAUTHORIZED");
	}

	try {
		const payload = jwt.verify(
			token,
			ACCESS_TOKEN_SECRET as string,
		) as AuthUserPayload;

		const tokenRecord = await database_models.Token.findOne({
			where: { token, type: "access" },
			include: [{ model: database_models.Status, as: "status" }],
		});

		if (!tokenRecord) {
			return sendAppError(res, "INVALID_TOKEN");
		}

		const status = (tokenRecord as { status?: { name?: string } }).status;

		if (tokenRecord.invalidatedAt || status?.name === "Invalidated") {
			return sendAppError(res, "SESSION_EXPIRED");
		}

		req.user = payload;
		next();
	} catch {
		return sendAppError(res, "INVALID_TOKEN");
	}
};

export const requirePermission =
	(...permissions: string[]) =>
	async (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user) {
			return sendAppError(res, "UNAUTHORIZED");
		}

		const hasPermission = permissions.some((p) =>
			req.user?.permissions.includes(p),
		);

		if (!hasPermission) {
			return sendAppError(res, "PERMISSION_DENIED");
		}

		next();
	};

export const requireAdmin = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		return sendAppError(res, "UNAUTHORIZED");
	}

	if (req.user.roleName !== "Admin") {
		return sendAppError(res, "FORBIDDEN");
	}

	next();
};

export const requireAdminOrHr = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		return sendAppError(res, "UNAUTHORIZED");
	}

	if (req.user.roleName !== "Admin" && req.user.roleName !== "HR") {
		return sendAppError(res, "FORBIDDEN");
	}

	next();
};
