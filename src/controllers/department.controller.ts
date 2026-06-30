import { Response } from "express";
import { AuthRequest } from "../types/express";
import { handleError, sendAppError, sendSucceeded } from "../utils/errors";
import * as departmentService from "../services/department.service";

export const listDepartments = async (req: AuthRequest, res: Response) => {
	try {
		const result = await departmentService.listDepartments(req.query);
		return sendSucceeded(res, "DEPARTMENTS_RETRIEVED", result);
	} catch {
		return sendAppError(res, "DEPARTMENTS_FETCH_FAILED");
	}
};

export const getDepartment = async (req: AuthRequest, res: Response) => {
	try {
		const department = await departmentService.getDepartmentById(req.params.id);
		return sendSucceeded(res, "DEPARTMENT_RETRIEVED", department);
	} catch (error) {
		return handleError(res, error, "DEPARTMENTS_FETCH_FAILED");
	}
};

export const createDepartment = async (req: AuthRequest, res: Response) => {
	try {
		const department = await departmentService.createDepartment(req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "DEPARTMENT_CREATED", department);
	} catch (error) {
		return handleError(res, error, "DEPARTMENT_CREATE_FAILED");
	}
};

export const updateDepartment = async (req: AuthRequest, res: Response) => {
	try {
		const department = await departmentService.updateDepartment(
			req.params.id,
			req.body,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "DEPARTMENT_UPDATED", department);
	} catch (error) {
		return handleError(res, error, "DEPARTMENT_UPDATE_FAILED");
	}
};

export const assignDepartmentManager = async (req: AuthRequest, res: Response) => {
	try {
		const department = await departmentService.assignDepartmentManager(
			req.params.id,
			req.body.managerId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "DEPARTMENT_MANAGER_ASSIGNED", department);
	} catch (error) {
		return handleError(res, error, "DEPARTMENT_MANAGER_ASSIGN_FAILED");
	}
};

export const assignDepartmentStatus = async (req: AuthRequest, res: Response) => {
	try {
		const department = await departmentService.assignDepartmentStatus(
			req.params.id,
			req.body.statusId,
			{ id: req.user!.id, roleName: req.user!.roleName },
		);
		return sendSucceeded(res, "DEPARTMENT_STATUS_ASSIGNED", department);
	} catch (error) {
		return handleError(res, error, "DEPARTMENT_STATUS_ASSIGN_FAILED");
	}
};

export const deactivateDepartment = async (req: AuthRequest, res: Response) => {
	try {
		const department = await departmentService.deactivateDepartment(req.params.id, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "DEPARTMENT_DEACTIVATED", department);
	} catch (error) {
		return handleError(res, error, "DEPARTMENT_DEACTIVATE_FAILED");
	}
};
