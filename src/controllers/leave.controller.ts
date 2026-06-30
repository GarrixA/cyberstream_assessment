import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as leaveService from "../services/leave.service";

const viewer = (req: AuthRequest) => ({
	id: req.user!.id,
	permissions: req.user!.permissions,
});

export const listLeaves = async (req: AuthRequest, res: Response) => {
	try {
		const result = await leaveService.listLeaves(req.query, viewer(req));
		return sendSucceeded(res, "LEAVES_RETRIEVED", result);
	} catch {
		return sendAppError(res, "LEAVES_FETCH_FAILED");
	}
};

export const getLeave = async (req: AuthRequest, res: Response) => {
	try {
		const leave = await leaveService.getLeaveById(req.params.id, viewer(req));
		return sendSucceeded(res, "LEAVE_RETRIEVED", leave);
	} catch (error) {
		return handleError(res, error, "LEAVES_FETCH_FAILED");
	}
};

export const createLeave = async (req: AuthRequest, res: Response) => {
	try {
		const leave = await leaveService.createLeave(req.body, viewer(req));
		return sendSucceeded(res, "LEAVE_CREATED", leave);
	} catch (error) {
		return handleError(res, error, "LEAVE_CREATE_FAILED");
	}
};

export const updateLeave = async (req: AuthRequest, res: Response) => {
	try {
		const leave = await leaveService.updateLeave(
			req.params.id,
			req.body,
			viewer(req),
		);
		return sendSucceeded(res, "LEAVE_UPDATED", leave);
	} catch (error) {
		return handleError(res, error, "LEAVE_UPDATE_FAILED");
	}
};

export const approveLeave = async (req: AuthRequest, res: Response) => {
	try {
		const leave = await leaveService.approveLeave(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "LEAVE_APPROVED", leave);
	} catch (error) {
		return handleError(res, error, "LEAVE_ACTION_FAILED");
	}
};

export const rejectLeave = async (req: AuthRequest, res: Response) => {
	try {
		const leave = await leaveService.rejectLeave(
			req.params.id,
			{ id: req.user!.id },
			req.body,
		);
		return sendSucceeded(res, "LEAVE_REJECTED", leave);
	} catch (error) {
		return handleError(res, error, "LEAVE_ACTION_FAILED");
	}
};

export const cancelLeave = async (req: AuthRequest, res: Response) => {
	try {
		const leave = await leaveService.cancelLeave(req.params.id, viewer(req));
		return sendSucceeded(res, "LEAVE_CANCELLED", leave);
	} catch (error) {
		return handleError(res, error, "LEAVE_CANCEL_FAILED");
	}
};
