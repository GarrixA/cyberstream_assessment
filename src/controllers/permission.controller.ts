import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as permissionService from "../services/permission.service";

export const listPermissions = async (req: AuthRequest, res: Response) => {
	try {
		const result = await permissionService.listPermissions(req.query);
		return sendSucceeded(res, "PERMISSIONS_RETRIEVED", result);
	} catch {
		return sendAppError(res, "PERMISSIONS_FETCH_FAILED");
	}
};

export const getPermission = async (req: AuthRequest, res: Response) => {
	try {
		const permission = await permissionService.getPermissionById(req.params.id);
		return sendSucceeded(res, "PERMISSION_RETRIEVED", permission);
	} catch (error) {
		return handleError(res, error, "PERMISSIONS_FETCH_FAILED");
	}
};

export const createPermission = async (req: AuthRequest, res: Response) => {
	try {
		const permission = await permissionService.createPermission(req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "PERMISSION_CREATED", permission);
	} catch (error) {
		return handleError(res, error, "PERMISSION_CREATE_FAILED");
	}
};

export const updatePermission = async (req: AuthRequest, res: Response) => {
	try {
		const permission = await permissionService.updatePermission(
			req.params.id,
			req.body,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "PERMISSION_UPDATED", permission);
	} catch (error) {
		return handleError(res, error, "PERMISSION_UPDATE_FAILED");
	}
};

export const deletePermission = async (req: AuthRequest, res: Response) => {
	try {
		await permissionService.deletePermission(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "PERMISSION_DELETED");
	} catch (error) {
		return handleError(res, error, "PERMISSION_DELETE_FAILED");
	}
};
