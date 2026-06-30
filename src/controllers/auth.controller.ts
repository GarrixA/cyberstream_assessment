import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as authService from "../services/auth.service";
import * as employeeService from "../services/employee.service";

const viewer = (req: AuthRequest) => ({
	id: req.user!.id,
	permissions: req.user!.permissions,
});

export const login = async (req: AuthRequest, res: Response) => {
	try {
		const result = await authService.login({
			email: req.body.email,
			password: req.body.password,
			ipAddress: req.ip,
			deviceInfo: req.headers["user-agent"],
		});
		return sendSucceeded(res, "LOGIN_SUCCESS", result);
	} catch (error) {
		return handleError(res, error, "LOGIN_FAILED");
	}
};

export const logout = async (req: AuthRequest, res: Response) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token || !req.user) {
			return sendAppError(res, "UNAUTHORIZED");
		}
		await authService.logout({
			userId: req.user.id,
			token,
		});
		return sendSucceeded(res, "LOGOUT_SUCCESS");
	} catch (error) {
		return handleError(res, error, "LOGOUT_FAILED");
	}
};

export const forgotPassword = async (req: AuthRequest, res: Response) => {
	try {
		const result = await authService.forgotPassword(req.body.email);
		const exposeResetDetails =
			process.env.NODE_ENV === "test" ||
			process.env.DEV_MODE === "development";
		return sendSucceeded(
			res,
			"FORGOT_PASSWORD_SUCCESS",
			exposeResetDetails ? result : undefined,
		);
	} catch {
		return sendAppError(res, "FORGOT_PASSWORD_FAILED");
	}
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
	try {
		await authService.resetPassword({
			code: req.params.code,
			newPassword: req.body.newPassword,
			confirmNewPassword: req.body.confirmNewPassword,
		});
		return sendSucceeded(res, "RESET_PASSWORD_SUCCESS");
	} catch (error) {
		return handleError(res, error, "RESET_PASSWORD_FAILED");
	}
};

export const verifyResetPassword = async (req: AuthRequest, res: Response) => {
	try {
		const result = await authService.verifyResetPassword({
			token: req.query.token as string | undefined,
			code: req.params.code,
		});
		return sendSucceeded(res, "RESET_PASSWORD_VERIFIED", result);
	} catch (error) {
		return handleError(res, error, "RESET_PASSWORD_FAILED");
	}
};

export const changePassword = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			return sendAppError(res, "UNAUTHORIZED");
		}
		await authService.changePassword({
			userId: req.user.id,
			currentPassword: req.body.currentPassword,
			newPassword: req.body.newPassword,
			confirmNewPassword: req.body.confirmNewPassword,
		});
		return sendSucceeded(res, "CHANGE_PASSWORD_SUCCESS");
	} catch (error) {
		return handleError(res, error, "CHANGE_PASSWORD_FAILED");
	}
};

export const listUsers = async (req: AuthRequest, res: Response) => {
	try {
		const result = await authService.listUsers(req.query);
		return sendSucceeded(res, "USERS_RETRIEVED", result);
	} catch {
		return sendAppError(res, "USERS_FETCH_FAILED");
	}
};

export const listManagers = async (req: AuthRequest, res: Response) => {
	try {
		const result = await authService.listManagers(req.query);
		return sendSucceeded(res, "MANAGERS_RETRIEVED", result);
	} catch {
		return sendAppError(res, "MANAGERS_FETCH_FAILED");
	}
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
	try {
		const user = await employeeService.getEmployeeById(req.user!.id, viewer(req));
		return sendSucceeded(res, "EMPLOYEE_RETRIEVED", user);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_FETCH_FAILED");
	}
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
	try {
		const user = await employeeService.updateEmployee(
			req.user!.id,
			req.body,
			viewer(req),
		);
		return sendSucceeded(res, "EMPLOYEE_UPDATED", user);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_UPDATE_FAILED");
	}
};

export const activateUser = async (req: AuthRequest, res: Response) => {
	try {
		const user = await authService.activateUser(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "USER_ACTIVATED", user);
	} catch (error) {
		return handleError(res, error, "USER_ACTIVATE_FAILED");
	}
};

export const deactivateUser = async (req: AuthRequest, res: Response) => {
	try {
		const user = await authService.deactivateUser(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "USER_DEACTIVATED", user);
	} catch (error) {
		return handleError(res, error, "USER_DEACTIVATE_FAILED");
	}
};
