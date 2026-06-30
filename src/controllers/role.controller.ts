import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as roleService from "../services/role.service";

export const listRoles = async (req: AuthRequest, res: Response) => {
	try {
		const result = await roleService.listRoles(req.query);
		return sendSucceeded(res, "ROLES_RETRIEVED", result);
	} catch {
		return sendAppError(res, "ROLES_FETCH_FAILED");
	}
};

export const getRole = async (req: AuthRequest, res: Response) => {
	try {
		const role = await roleService.getRoleById(req.params.id);
		return sendSucceeded(res, "ROLE_RETRIEVED", role);
	} catch (error) {
		return handleError(res, error, "ROLES_FETCH_FAILED");
	}
};

export const createRole = async (req: AuthRequest, res: Response) => {
	try {
		const role = await roleService.createRole(req.body, { id: req.user!.id });
		return sendSucceeded(res, "ROLE_CREATED", role);
	} catch (error) {
		return handleError(res, error, "ROLE_CREATE_FAILED");
	}
};

export const updateRole = async (req: AuthRequest, res: Response) => {
	try {
		const role = await roleService.updateRole(req.params.id, req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "ROLE_UPDATED", role);
	} catch (error) {
		return handleError(res, error, "ROLE_UPDATE_FAILED");
	}
};

export const assignRolePermissions = async (req: AuthRequest, res: Response) => {
	try {
		const role = await roleService.assignRolePermissions(
			req.params.id,
			req.body.permissionIds,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "ROLE_PERMISSIONS_ASSIGNED", role);
	} catch (error) {
		return handleError(res, error, "ROLE_PERMISSIONS_ASSIGN_FAILED");
	}
};

export const assignRoleStatus = async (req: AuthRequest, res: Response) => {
	try {
		const role = await roleService.assignRoleStatus(
			req.params.id,
			req.body.statusId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "ROLE_STATUS_ASSIGNED", role);
	} catch (error) {
		return handleError(res, error, "ROLE_STATUS_ASSIGN_FAILED");
	}
};

export const deleteRole = async (req: AuthRequest, res: Response) => {
	try {
		await roleService.deleteRole(req.params.id, { id: req.user!.id });
		return sendSucceeded(res, "ROLE_DELETED");
	} catch (error) {
		return handleError(res, error, "ROLE_DELETE_FAILED");
	}
};
