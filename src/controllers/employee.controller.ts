import { Response } from "express";
import { AuthRequest } from "../types/express";
import {
	handleError,
	sendAppError,
	sendSucceeded,
} from "../utils/errors";
import * as employeeService from "../services/employee.service";

const viewer = (req: AuthRequest) => ({
	id: req.user!.id,
	permissions: req.user!.permissions,
});

export const listEmployees = async (req: AuthRequest, res: Response) => {
	try {
		const result = await employeeService.listEmployees(req.query, viewer(req));
		return sendSucceeded(res, "EMPLOYEES_RETRIEVED", result);
	} catch {
		return sendAppError(res, "EMPLOYEES_FETCH_FAILED");
	}
};

export const getEmployee = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.getEmployeeById(
			req.params.id,
			viewer(req),
		);
		return sendSucceeded(res, "EMPLOYEE_RETRIEVED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_FETCH_FAILED");
	}
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.createEmployee(req.body, {
			id: req.user!.id,
		});
		return sendSucceeded(res, "EMPLOYEE_CREATED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_CREATE_FAILED");
	}
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.updateEmployee(
			req.params.id,
			req.body,
			viewer(req),
		);
		return sendSucceeded(res, "EMPLOYEE_UPDATED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_UPDATE_FAILED");
	}
};

export const deactivateEmployee = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.deactivateEmployee(
			req.params.id,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYEE_DEACTIVATED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_DEACTIVATE_FAILED");
	}
};

export const assignEmployeeRole = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.assignEmployeeRole(
			req.params.id,
			req.body.roleId,
			viewer(req),
		);
		return sendSucceeded(res, "EMPLOYEE_ROLE_ASSIGNED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_ROLE_ASSIGN_FAILED");
	}
};

export const assignEmployeeDepartment = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.assignEmployeeDepartment(
			req.params.id,
			req.body.departmentId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYEE_DEPARTMENT_ASSIGNED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_DEPARTMENT_ASSIGN_FAILED");
	}
};

export const assignEmployeePosition = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.assignEmployeePosition(
			req.params.id,
			req.body.positionId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYEE_POSITION_ASSIGNED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_POSITION_ASSIGN_FAILED");
	}
};

export const assignEmployeeManager = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.assignEmployeeManager(
			req.params.id,
			req.body.managerId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYEE_MANAGER_ASSIGNED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_MANAGER_ASSIGN_FAILED");
	}
};

export const assignEmployeeEmploymentType = async (
	req: AuthRequest,
	res: Response,
) => {
	try {
		const employee = await employeeService.assignEmployeeEmploymentType(
			req.params.id,
			req.body.employmentTypeId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYEE_EMPLOYMENT_TYPE_ASSIGNED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_EMPLOYMENT_TYPE_ASSIGN_FAILED");
	}
};

export const assignEmployeeStatus = async (req: AuthRequest, res: Response) => {
	try {
		const employee = await employeeService.assignEmployeeStatus(
			req.params.id,
			req.body.statusId,
			{ id: req.user!.id },
		);
		return sendSucceeded(res, "EMPLOYEE_STATUS_ASSIGNED", employee);
	} catch (error) {
		return handleError(res, error, "EMPLOYEE_STATUS_ASSIGN_FAILED");
	}
};

export const listAuditLogs = async (req: AuthRequest, res: Response) => {
	try {
		const result = await employeeService.listAuditLogs(req.query);
		return sendSucceeded(res, "AUDIT_LOGS_RETRIEVED", result);
	} catch {
		return sendAppError(res, "AUDIT_LOGS_FETCH_FAILED");
	}
};

export const listAttendance = async (req: AuthRequest, res: Response) => {
	try {
		const result = await employeeService.listAttendance(req.query, viewer(req));
		return sendSucceeded(res, "ATTENDANCE_RETRIEVED", result);
	} catch (error) {
		return handleError(res, error, "ATTENDANCE_FETCH_FAILED");
	}
};
