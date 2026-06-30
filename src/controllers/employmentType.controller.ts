import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as employmentTypeService from "../services/employmentType.service";

export const listEmploymentTypes = async (req: AuthRequest, res: Response) => {
	try {
		const result = await employmentTypeService.listEmploymentTypes(req.query);
		return sendSucceeded(res, "EMPLOYMENT_TYPES_RETRIEVED", result);
	} catch {
		return sendAppError(res, "EMPLOYMENT_TYPES_FETCH_FAILED");
	}
};

export const getEmploymentType = async (req: AuthRequest, res: Response) => {
	try {
		const employmentType = await employmentTypeService.getEmploymentTypeById(
			req.params.id,
		);
		return sendSucceeded(res, "EMPLOYMENT_TYPE_RETRIEVED", employmentType);
	} catch (error) {
		return handleError(res, error, "EMPLOYMENT_TYPES_FETCH_FAILED");
	}
};

export const createEmploymentType = async (req: AuthRequest, res: Response) => {
	try {
		const employmentType = await employmentTypeService.createEmploymentType(
			req.body,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYMENT_TYPE_CREATED", employmentType);
	} catch (error) {
		return handleError(res, error, "EMPLOYMENT_TYPE_CREATE_FAILED");
	}
};

export const updateEmploymentType = async (req: AuthRequest, res: Response) => {
	try {
		const employmentType = await employmentTypeService.updateEmploymentType(
			req.params.id,
			req.body,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYMENT_TYPE_UPDATED", employmentType);
	} catch (error) {
		return handleError(res, error, "EMPLOYMENT_TYPE_UPDATE_FAILED");
	}
};

export const deleteEmploymentType = async (req: AuthRequest, res: Response) => {
	try {
		await employmentTypeService.deleteEmploymentType(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "EMPLOYMENT_TYPE_DELETED");
	} catch (error) {
		return handleError(res, error, "EMPLOYMENT_TYPE_DELETE_FAILED");
	}
};
