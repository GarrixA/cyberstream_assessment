import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as statusService from "../services/status.service";

export const listStatuses = async (req: AuthRequest, res: Response) => {
	try {
		const result = await statusService.listStatuses(req.query);
		return sendSucceeded(res, "STATUSES_RETRIEVED", result);
	} catch {
		return sendAppError(res, "STATUSES_FETCH_FAILED");
	}
};

export const getStatus = async (req: AuthRequest, res: Response) => {
	try {
		const status = await statusService.getStatusById(req.params.id);
		return sendSucceeded(res, "STATUS_RETRIEVED", status);
	} catch (error) {
		return handleError(res, error, "STATUSES_FETCH_FAILED");
	}
};

export const createStatus = async (req: AuthRequest, res: Response) => {
	try {
		const status = await statusService.createStatus(req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "STATUS_CREATED", status);
	} catch (error) {
		return handleError(res, error, "STATUS_CREATE_FAILED");
	}
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
	try {
		const status = await statusService.updateStatus(req.params.id, req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "STATUS_UPDATED", status);
	} catch (error) {
		return handleError(res, error, "STATUS_UPDATE_FAILED");
	}
};

export const deleteStatus = async (req: AuthRequest, res: Response) => {
	try {
		await statusService.deleteStatus(req.params.id, { id: req.user!.id });
		return sendSucceeded(res, "STATUS_DELETED");
	} catch (error) {
		return handleError(res, error, "STATUS_DELETE_FAILED");
	}
};
