import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as positionService from "../services/position.service";

export const listPositions = async (req: AuthRequest, res: Response) => {
	try {
		const result = await positionService.listPositions(req.query);
		return sendSucceeded(res, "POSITIONS_RETRIEVED", result);
	} catch {
		return sendAppError(res, "POSITIONS_FETCH_FAILED");
	}
};

export const getPosition = async (req: AuthRequest, res: Response) => {
	try {
		const position = await positionService.getPositionById(req.params.id);
		return sendSucceeded(res, "POSITION_RETRIEVED", position);
	} catch (error) {
		return handleError(res, error, "POSITIONS_FETCH_FAILED");
	}
};

export const createPosition = async (req: AuthRequest, res: Response) => {
	try {
		const position = await positionService.createPosition(req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "POSITION_CREATED", position);
	} catch (error) {
		return handleError(res, error, "POSITION_CREATE_FAILED");
	}
};

export const updatePosition = async (req: AuthRequest, res: Response) => {
	try {
		const position = await positionService.updatePosition(
			req.params.id,
			req.body,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "POSITION_UPDATED", position);
	} catch (error) {
		return handleError(res, error, "POSITION_UPDATE_FAILED");
	}
};

export const assignPositionDepartment = async (req: AuthRequest, res: Response) => {
	try {
		const position = await positionService.assignPositionDepartment(
			req.params.id,
			req.body.departmentId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "POSITION_DEPARTMENT_ASSIGNED", position);
	} catch (error) {
		return handleError(res, error, "POSITION_DEPARTMENT_ASSIGN_FAILED");
	}
};

export const assignPositionStatus = async (req: AuthRequest, res: Response) => {
	try {
		const position = await positionService.assignPositionStatus(
			req.params.id,
			req.body.statusId,
			{ id: req.user!.id, roleName: req.user!.roleName },
		);
		return sendSucceeded(res, "POSITION_STATUS_ASSIGNED", position);
	} catch (error) {
		return handleError(res, error, "POSITION_STATUS_ASSIGN_FAILED");
	}
};

export const deactivatePosition = async (req: AuthRequest, res: Response) => {
	try {
		const position = await positionService.deactivatePosition(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "POSITION_DEACTIVATED", position);
	} catch (error) {
		return handleError(res, error, "POSITION_DEACTIVATE_FAILED");
	}
};
