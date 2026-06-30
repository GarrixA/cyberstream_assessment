import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as payrollService from "../services/payroll.service";

export const listPayroll = async (req: AuthRequest, res: Response) => {
	try {
		const result = await payrollService.listPayroll(req.query);
		return sendSucceeded(res, "PAYROLL_RETRIEVED", result);
	} catch {
		return sendAppError(res, "PAYROLL_FETCH_FAILED");
	}
};

export const getPayroll = async (req: AuthRequest, res: Response) => {
	try {
		const record = await payrollService.getPayrollById(req.params.id);
		return sendSucceeded(res, "PAYROLL_RECORD_RETRIEVED", record);
	} catch (error) {
		return handleError(res, error, "PAYROLL_FETCH_FAILED");
	}
};

export const createPayroll = async (req: AuthRequest, res: Response) => {
	try {
		const record = await payrollService.createPayroll(req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "PAYROLL_CREATED", record);
	} catch (error) {
		return handleError(res, error, "PAYROLL_CREATE_FAILED");
	}
};

export const updatePayroll = async (req: AuthRequest, res: Response) => {
	try {
		const record = await payrollService.updatePayroll(
			req.params.id,
			req.body,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "PAYROLL_UPDATED", record);
	} catch (error) {
		return handleError(res, error, "PAYROLL_UPDATE_FAILED");
	}
};

export const deletePayroll = async (req: AuthRequest, res: Response) => {
	try {
		await payrollService.deletePayroll(req.params.id, { id: req.user!.id });
		return sendSucceeded(res, "PAYROLL_DELETED");
	} catch (error) {
		return handleError(res, error, "PAYROLL_DELETE_FAILED");
	}
};
