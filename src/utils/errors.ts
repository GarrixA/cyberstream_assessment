import { Response } from "express";
import {
	DatabaseError,
	UniqueConstraintError,
	ValidationError,
} from "sequelize";
import { sendResponse } from "./response";

export const ResponseStatus = {
	SUCCESS: "SUCCESS",
	CREATED: "CREATED",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	NOT_FOUND: "NOT_FOUND",
	BAD_REQUEST: "BAD_REQUEST",
	ERROR: "ERROR",
} as const;

export type ResponseStatusType =
	(typeof ResponseStatus)[keyof typeof ResponseStatus];

export const AppErrors = {
	INVALID_CREDENTIALS: {
		code: "INVALID_CREDENTIALS",
		statusCode: 401,
		status: ResponseStatus.UNAUTHORIZED,
		message: "Invalid email or password",
	},
	ACCOUNT_INACTIVE: {
		code: "ACCOUNT_INACTIVE",
		statusCode: 403,
		status: ResponseStatus.FORBIDDEN,
		message: "Your account is not active",
	},
	UNAUTHORIZED: {
		code: "UNAUTHORIZED",
		statusCode: 401,
		status: ResponseStatus.UNAUTHORIZED,
		message: "Please login to continue",
	},
	SESSION_EXPIRED: {
		code: "SESSION_EXPIRED",
		statusCode: 401,
		status: ResponseStatus.UNAUTHORIZED,
		message: "Session expired, please login again",
	},
	INVALID_TOKEN: {
		code: "INVALID_TOKEN",
		statusCode: 401,
		status: ResponseStatus.UNAUTHORIZED,
		message: "Invalid or expired token",
	},
	PERMISSION_DENIED: {
		code: "PERMISSION_DENIED",
		statusCode: 403,
		status: ResponseStatus.FORBIDDEN,
		message: "You do not have permission to perform this action",
	},
	VALIDATION_ERROR: {
		code: "VALIDATION_ERROR",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Validation failed",
	},
	FORBIDDEN: {
		code: "FORBIDDEN",
		statusCode: 403,
		status: ResponseStatus.FORBIDDEN,
		message: "Access denied",
	},
	NOT_FOUND: {
		code: "NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Resource not found",
	},
	EMPLOYEE_NOT_FOUND: {
		code: "EMPLOYEE_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Employee not found",
	},
	USER_NOT_FOUND: {
		code: "USER_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "User not found",
	},
	INVALID_RESET_TOKEN: {
		code: "INVALID_RESET_TOKEN",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Invalid or expired reset code",
	},
	PASSWORDS_DO_NOT_MATCH: {
		code: "PASSWORDS_DO_NOT_MATCH",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "New password and confirmation do not match",
	},
	INVALID_PASSWORD: {
		code: "INVALID_PASSWORD",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Current password is incorrect",
	},
	LOGIN_FAILED: {
		code: "LOGIN_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Login failed",
	},
	LOGOUT_FAILED: {
		code: "LOGOUT_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Logout failed",
	},
	FORGOT_PASSWORD_FAILED: {
		code: "FORGOT_PASSWORD_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to process request",
	},
	RESET_PASSWORD_FAILED: {
		code: "RESET_PASSWORD_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Password reset failed",
	},
	CHANGE_PASSWORD_FAILED: {
		code: "CHANGE_PASSWORD_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Password change failed",
	},
	USERS_FETCH_FAILED: {
		code: "USERS_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve users",
	},
	MANAGERS_FETCH_FAILED: {
		code: "MANAGERS_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve managers",
	},
	USER_ACTIVATE_FAILED: {
		code: "USER_ACTIVATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to activate user",
	},
	USER_DEACTIVATE_FAILED: {
		code: "USER_DEACTIVATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to deactivate user",
	},
	USER_ALREADY_ACTIVE: {
		code: "USER_ALREADY_ACTIVE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "User is already active",
	},
	USER_ALREADY_INACTIVE: {
		code: "USER_ALREADY_INACTIVE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "User is already inactive",
	},
	CANNOT_DEACTIVATE_SELF: {
		code: "CANNOT_DEACTIVATE_SELF",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "You cannot deactivate your own account",
	},
	EMPLOYEES_FETCH_FAILED: {
		code: "EMPLOYEES_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve employees",
	},
	EMPLOYEE_FETCH_FAILED: {
		code: "EMPLOYEE_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve employee",
	},
	EMPLOYEE_CREATE_FAILED: {
		code: "EMPLOYEE_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create employee",
	},
	EMPLOYEE_INVALID_REFERENCE: {
		code: "EMPLOYEE_INVALID_REFERENCE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Invalid employee reference",
	},
	EMPLOYEE_UPDATE_FAILED: {
		code: "EMPLOYEE_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update employee",
	},
	EMPLOYEE_DEACTIVATE_FAILED: {
		code: "EMPLOYEE_DEACTIVATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to deactivate employee",
	},
	EMPLOYEE_ROLE_ASSIGN_FAILED: {
		code: "EMPLOYEE_ROLE_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign employee role",
	},
	EMPLOYEE_DEPARTMENT_ASSIGN_FAILED: {
		code: "EMPLOYEE_DEPARTMENT_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign employee department",
	},
	EMPLOYEE_POSITION_ASSIGN_FAILED: {
		code: "EMPLOYEE_POSITION_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign employee position",
	},
	EMPLOYEE_MANAGER_ASSIGN_FAILED: {
		code: "EMPLOYEE_MANAGER_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign employee manager",
	},
	EMPLOYEE_EMPLOYMENT_TYPE_ASSIGN_FAILED: {
		code: "EMPLOYEE_EMPLOYMENT_TYPE_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign employee employment type",
	},
	EMPLOYEE_STATUS_ASSIGN_FAILED: {
		code: "EMPLOYEE_STATUS_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign employee status",
	},
	EMPLOYEE_INVALID_STATUS: {
		code: "EMPLOYEE_INVALID_STATUS",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Status must belong to the user category",
	},
	EMPLOYEE_INACTIVE_STATUS_ADMIN_ONLY: {
		code: "EMPLOYEE_INACTIVE_STATUS_ADMIN_ONLY",
		statusCode: 403,
		status: ResponseStatus.FORBIDDEN,
		message: "Use deactivate endpoint to set employee inactive",
	},
	DEPARTMENTS_FETCH_FAILED: {
		code: "DEPARTMENTS_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve departments",
	},
	DEPARTMENT_NOT_FOUND: {
		code: "DEPARTMENT_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Department not found",
	},
	DEPARTMENT_CREATE_FAILED: {
		code: "DEPARTMENT_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create department",
	},
	DEPARTMENT_UPDATE_FAILED: {
		code: "DEPARTMENT_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update department",
	},
	DEPARTMENT_DEACTIVATE_FAILED: {
		code: "DEPARTMENT_DEACTIVATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to deactivate department",
	},
	DEPARTMENT_MANAGER_ASSIGN_FAILED: {
		code: "DEPARTMENT_MANAGER_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign department manager",
	},
	DEPARTMENT_STATUS_ASSIGN_FAILED: {
		code: "DEPARTMENT_STATUS_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign department status",
	},
	DEPARTMENT_INVALID_STATUS: {
		code: "DEPARTMENT_INVALID_STATUS",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Status must belong to the department category",
	},
	DEPARTMENT_INACTIVE_STATUS_ADMIN_ONLY: {
		code: "DEPARTMENT_INACTIVE_STATUS_ADMIN_ONLY",
		statusCode: 403,
		status: ResponseStatus.FORBIDDEN,
		message: "Only admins can deactivate departments",
	},
	POSITIONS_FETCH_FAILED: {
		code: "POSITIONS_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve positions",
	},
	POSITION_NOT_FOUND: {
		code: "POSITION_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Position not found",
	},
	POSITION_CREATE_FAILED: {
		code: "POSITION_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create position",
	},
	POSITION_UPDATE_FAILED: {
		code: "POSITION_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update position",
	},
	POSITION_DEACTIVATE_FAILED: {
		code: "POSITION_DEACTIVATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to deactivate position",
	},
	POSITION_DEPARTMENT_ASSIGN_FAILED: {
		code: "POSITION_DEPARTMENT_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign position department",
	},
	POSITION_STATUS_ASSIGN_FAILED: {
		code: "POSITION_STATUS_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign position status",
	},
	POSITION_INVALID_STATUS: {
		code: "POSITION_INVALID_STATUS",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Status must belong to the position category",
	},
	POSITION_INACTIVE_STATUS_ADMIN_ONLY: {
		code: "POSITION_INACTIVE_STATUS_ADMIN_ONLY",
		statusCode: 403,
		status: ResponseStatus.FORBIDDEN,
		message: "Only admins can deactivate positions",
	},
	EMPLOYMENT_TYPES_FETCH_FAILED: {
		code: "EMPLOYMENT_TYPES_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve employment types",
	},
	EMPLOYMENT_TYPE_NOT_FOUND: {
		code: "EMPLOYMENT_TYPE_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Employment type not found",
	},
	EMPLOYMENT_TYPE_CREATE_FAILED: {
		code: "EMPLOYMENT_TYPE_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create employment type",
	},
	EMPLOYMENT_TYPE_UPDATE_FAILED: {
		code: "EMPLOYMENT_TYPE_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update employment type",
	},
	EMPLOYMENT_TYPE_DELETE_FAILED: {
		code: "EMPLOYMENT_TYPE_DELETE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to delete employment type",
	},
	EMPLOYMENT_TYPE_IN_USE: {
		code: "EMPLOYMENT_TYPE_IN_USE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Employment type is assigned to employees and cannot be deleted",
	},
	ROLES_FETCH_FAILED: {
		code: "ROLES_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve roles",
	},
	ROLE_NOT_FOUND: {
		code: "ROLE_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Role not found",
	},
	ROLE_CREATE_FAILED: {
		code: "ROLE_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create role",
	},
	ROLE_UPDATE_FAILED: {
		code: "ROLE_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update role",
	},
	ROLE_DELETE_FAILED: {
		code: "ROLE_DELETE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to delete role",
	},
	ROLE_IN_USE: {
		code: "ROLE_IN_USE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Role is assigned to employees and cannot be deleted",
	},
	ROLE_PERMISSIONS_ASSIGN_FAILED: {
		code: "ROLE_PERMISSIONS_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign role permissions",
	},
	ROLE_STATUS_ASSIGN_FAILED: {
		code: "ROLE_STATUS_ASSIGN_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to assign role status",
	},
	ROLE_INVALID_STATUS: {
		code: "ROLE_INVALID_STATUS",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Status must belong to the role category",
	},
	STATUSES_FETCH_FAILED: {
		code: "STATUSES_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve statuses",
	},
	STATUS_NOT_FOUND: {
		code: "STATUS_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Status not found",
	},
	STATUS_CREATE_FAILED: {
		code: "STATUS_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create status",
	},
	STATUS_UPDATE_FAILED: {
		code: "STATUS_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update status",
	},
	STATUS_DELETE_FAILED: {
		code: "STATUS_DELETE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to delete status",
	},
	STATUS_IN_USE: {
		code: "STATUS_IN_USE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Status is in use and cannot be deleted",
	},
	PERMISSIONS_FETCH_FAILED: {
		code: "PERMISSIONS_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve permissions",
	},
	PERMISSION_NOT_FOUND: {
		code: "PERMISSION_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Permission not found",
	},
	PERMISSION_CREATE_FAILED: {
		code: "PERMISSION_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create permission",
	},
	PERMISSION_UPDATE_FAILED: {
		code: "PERMISSION_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update permission",
	},
	PERMISSION_DELETE_FAILED: {
		code: "PERMISSION_DELETE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to delete permission",
	},
	PERMISSION_IN_USE: {
		code: "PERMISSION_IN_USE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Permission is assigned to roles and cannot be deleted",
	},
	AUDIT_LOGS_FETCH_FAILED: {
		code: "AUDIT_LOGS_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve audit logs",
	},
	ATTENDANCE_FETCH_FAILED: {
		code: "ATTENDANCE_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve attendance",
	},
	ATTENDANCE_INVALID_DATE: {
		code: "ATTENDANCE_INVALID_DATE",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Invalid attendance date filter",
	},
	LEAVES_FETCH_FAILED: {
		code: "LEAVES_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve leave records",
	},
	LEAVE_NOT_FOUND: {
		code: "LEAVE_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Leave request not found",
	},
	LEAVE_CREATE_FAILED: {
		code: "LEAVE_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create leave request",
	},
	LEAVE_UPDATE_FAILED: {
		code: "LEAVE_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update leave request",
	},
	LEAVE_CANCEL_FAILED: {
		code: "LEAVE_CANCEL_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to cancel leave request",
	},
	LEAVE_ACTION_FAILED: {
		code: "LEAVE_ACTION_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Leave action could not be completed",
	},
	LEAVE_INVALID_DURATION: {
		code: "LEAVE_INVALID_DURATION",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Invalid leave duration",
	},
	PAYROLL_FETCH_FAILED: {
		code: "PAYROLL_FETCH_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to retrieve payroll records",
	},
	PAYROLL_NOT_FOUND: {
		code: "PAYROLL_NOT_FOUND",
		statusCode: 404,
		status: ResponseStatus.NOT_FOUND,
		message: "Payroll record not found",
	},
	PAYROLL_CREATE_FAILED: {
		code: "PAYROLL_CREATE_FAILED",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Failed to create payroll record",
	},
	PAYROLL_UPDATE_FAILED: {
		code: "PAYROLL_UPDATE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to update payroll record",
	},
	PAYROLL_DELETE_FAILED: {
		code: "PAYROLL_DELETE_FAILED",
		statusCode: 500,
		status: ResponseStatus.ERROR,
		message: "Failed to delete payroll record",
	},
	PAYROLL_DELETE_NOT_PENDING: {
		code: "PAYROLL_DELETE_NOT_PENDING",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Only pending payroll records can be deleted",
	},
	PAYROLL_SALARY_NOT_SET: {
		code: "PAYROLL_SALARY_NOT_SET",
		statusCode: 400,
		status: ResponseStatus.BAD_REQUEST,
		message: "Employee salary is not set",
	},
	PAYROLL_ALREADY_EXISTS: {
		code: "PAYROLL_ALREADY_EXISTS",
		statusCode: 409,
		status: ResponseStatus.BAD_REQUEST,
		message: "A payroll record already exists for this employee in the current pay period",
	},
} as const;

export const AppSucceeded = {
	LOGIN_SUCCESS: {
		code: "LOGIN_SUCCESS",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Login successful",
	},
	LOGOUT_SUCCESS: {
		code: "LOGOUT_SUCCESS",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Logout successful",
	},
	FORGOT_PASSWORD_SUCCESS: {
		code: "FORGOT_PASSWORD_SUCCESS",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "If the email exists, a reset code has been sent",
	},
	RESET_PASSWORD_SUCCESS: {
		code: "RESET_PASSWORD_SUCCESS",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Password reset successful",
	},
	RESET_PASSWORD_VERIFIED: {
		code: "RESET_PASSWORD_VERIFIED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Reset code verified",
	},
	CHANGE_PASSWORD_SUCCESS: {
		code: "CHANGE_PASSWORD_SUCCESS",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Password changed successfully",
	},
	USERS_RETRIEVED: {
		code: "USERS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Users retrieved",
	},
	MANAGERS_RETRIEVED: {
		code: "MANAGERS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Managers retrieved",
	},
	USER_ACTIVATED: {
		code: "USER_ACTIVATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "User activated",
	},
	USER_DEACTIVATED: {
		code: "USER_DEACTIVATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "User deactivated",
	},
	EMPLOYEES_RETRIEVED: {
		code: "EMPLOYEES_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employees retrieved",
	},
	EMPLOYEE_RETRIEVED: {
		code: "EMPLOYEE_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee retrieved",
	},
	EMPLOYEE_CREATED: {
		code: "EMPLOYEE_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Employee created",
	},
	EMPLOYEE_UPDATED: {
		code: "EMPLOYEE_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee updated",
	},
	EMPLOYEE_DEACTIVATED: {
		code: "EMPLOYEE_DEACTIVATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee deactivated",
	},
	EMPLOYEE_ROLE_ASSIGNED: {
		code: "EMPLOYEE_ROLE_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee role assigned",
	},
	EMPLOYEE_DEPARTMENT_ASSIGNED: {
		code: "EMPLOYEE_DEPARTMENT_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee department assigned",
	},
	EMPLOYEE_POSITION_ASSIGNED: {
		code: "EMPLOYEE_POSITION_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee position assigned",
	},
	EMPLOYEE_MANAGER_ASSIGNED: {
		code: "EMPLOYEE_MANAGER_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee manager assigned",
	},
	EMPLOYEE_EMPLOYMENT_TYPE_ASSIGNED: {
		code: "EMPLOYEE_EMPLOYMENT_TYPE_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee employment type assigned",
	},
	EMPLOYEE_STATUS_ASSIGNED: {
		code: "EMPLOYEE_STATUS_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employee status assigned",
	},
	DEPARTMENTS_RETRIEVED: {
		code: "DEPARTMENTS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Departments retrieved",
	},
	DEPARTMENT_RETRIEVED: {
		code: "DEPARTMENT_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Department retrieved",
	},
	DEPARTMENT_CREATED: {
		code: "DEPARTMENT_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Department created",
	},
	DEPARTMENT_UPDATED: {
		code: "DEPARTMENT_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Department updated",
	},
	DEPARTMENT_DEACTIVATED: {
		code: "DEPARTMENT_DEACTIVATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Department deactivated",
	},
	DEPARTMENT_MANAGER_ASSIGNED: {
		code: "DEPARTMENT_MANAGER_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Department manager assigned",
	},
	DEPARTMENT_STATUS_ASSIGNED: {
		code: "DEPARTMENT_STATUS_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Department status assigned",
	},
	POSITIONS_RETRIEVED: {
		code: "POSITIONS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Positions retrieved",
	},
	POSITION_RETRIEVED: {
		code: "POSITION_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Position retrieved",
	},
	POSITION_CREATED: {
		code: "POSITION_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Position created",
	},
	POSITION_UPDATED: {
		code: "POSITION_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Position updated",
	},
	POSITION_DEACTIVATED: {
		code: "POSITION_DEACTIVATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Position deactivated",
	},
	POSITION_DEPARTMENT_ASSIGNED: {
		code: "POSITION_DEPARTMENT_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Position department assigned",
	},
	POSITION_STATUS_ASSIGNED: {
		code: "POSITION_STATUS_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Position status assigned",
	},
	EMPLOYMENT_TYPES_RETRIEVED: {
		code: "EMPLOYMENT_TYPES_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employment types retrieved",
	},
	EMPLOYMENT_TYPE_RETRIEVED: {
		code: "EMPLOYMENT_TYPE_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employment type retrieved",
	},
	EMPLOYMENT_TYPE_CREATED: {
		code: "EMPLOYMENT_TYPE_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Employment type created",
	},
	EMPLOYMENT_TYPE_UPDATED: {
		code: "EMPLOYMENT_TYPE_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employment type updated",
	},
	EMPLOYMENT_TYPE_DELETED: {
		code: "EMPLOYMENT_TYPE_DELETED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Employment type deleted",
	},
	ROLES_RETRIEVED: {
		code: "ROLES_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Roles retrieved",
	},
	ROLE_RETRIEVED: {
		code: "ROLE_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Role retrieved",
	},
	ROLE_CREATED: {
		code: "ROLE_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Role created",
	},
	ROLE_UPDATED: {
		code: "ROLE_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Role updated",
	},
	ROLE_DELETED: {
		code: "ROLE_DELETED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Role deleted",
	},
	ROLE_PERMISSIONS_ASSIGNED: {
		code: "ROLE_PERMISSIONS_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Role permissions assigned",
	},
	ROLE_STATUS_ASSIGNED: {
		code: "ROLE_STATUS_ASSIGNED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Role status assigned",
	},
	STATUSES_RETRIEVED: {
		code: "STATUSES_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Statuses retrieved",
	},
	STATUS_RETRIEVED: {
		code: "STATUS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Status retrieved",
	},
	STATUS_CREATED: {
		code: "STATUS_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Status created",
	},
	STATUS_UPDATED: {
		code: "STATUS_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Status updated",
	},
	STATUS_DELETED: {
		code: "STATUS_DELETED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Status deleted",
	},
	PERMISSIONS_RETRIEVED: {
		code: "PERMISSIONS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Permissions retrieved",
	},
	PERMISSION_RETRIEVED: {
		code: "PERMISSION_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Permission retrieved",
	},
	PERMISSION_CREATED: {
		code: "PERMISSION_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Permission created",
	},
	PERMISSION_UPDATED: {
		code: "PERMISSION_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Permission updated",
	},
	PERMISSION_DELETED: {
		code: "PERMISSION_DELETED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Permission deleted",
	},
	AUDIT_LOGS_RETRIEVED: {
		code: "AUDIT_LOGS_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Audit logs retrieved",
	},
	ATTENDANCE_RETRIEVED: {
		code: "ATTENDANCE_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Attendance retrieved",
	},
	LEAVES_RETRIEVED: {
		code: "LEAVES_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Leave records retrieved",
	},
	LEAVE_RETRIEVED: {
		code: "LEAVE_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Leave request retrieved",
	},
	LEAVE_CREATED: {
		code: "LEAVE_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Leave request created",
	},
	LEAVE_UPDATED: {
		code: "LEAVE_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Leave request updated",
	},
	LEAVE_CANCELLED: {
		code: "LEAVE_CANCELLED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Leave request cancelled",
	},
	LEAVE_APPROVED: {
		code: "LEAVE_APPROVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Leave request approved",
	},
	LEAVE_REJECTED: {
		code: "LEAVE_REJECTED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Leave request rejected",
	},
	PAYROLL_RETRIEVED: {
		code: "PAYROLL_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Payroll records retrieved",
	},
	PAYROLL_RECORD_RETRIEVED: {
		code: "PAYROLL_RECORD_RETRIEVED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Payroll record retrieved",
	},
	PAYROLL_CREATED: {
		code: "PAYROLL_CREATED",
		statusCode: 201,
		status: ResponseStatus.CREATED,
		message: "Payroll record created",
	},
	PAYROLL_UPDATED: {
		code: "PAYROLL_UPDATED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Payroll record updated",
	},
	PAYROLL_DELETED: {
		code: "PAYROLL_DELETED",
		statusCode: 200,
		status: ResponseStatus.SUCCESS,
		message: "Payroll record deleted",
	},
} as const;

export type AppErrorCode = keyof typeof AppErrors;
export type AppSucceededCode = keyof typeof AppSucceeded;

export class ApplicationError extends Error {
	readonly code: AppErrorCode;
	readonly statusCode: number;
	readonly status: ResponseStatusType;

	constructor(code: AppErrorCode, message?: string) {
		const definition = AppErrors[code];
		super(message ?? definition.message);
		this.code = code;
		this.statusCode = definition.statusCode;
		this.status = definition.status;
		this.name = "ApplicationError";
	}

	static from(code: AppErrorCode, message?: string) {
		return new ApplicationError(code, message);
	}
}

export const throwError = (code: AppErrorCode, message?: string): never => {
	throw ApplicationError.from(code, message);
};

const getUnderlyingErrorMessage = (error: unknown): string | undefined => {
	if (error instanceof ValidationError) {
		return error.errors.map((item) => item.message).join(", ");
	}

	if (error instanceof UniqueConstraintError) {
		const field = error.errors[0]?.path;
		return field ? `${field} already exists` : "A unique field value already exists";
	}

	if (error instanceof DatabaseError) {
		const parent = error.parent as {
			column?: string;
			constraint?: string;
			detail?: string;
		};

		if (parent?.constraint?.includes("email") || parent?.column === "email") {
			return "email already exists";
		}

		if (parent?.constraint?.includes("employeeCode")) {
			return "employeeCode already exists";
		}

		if (parent?.detail) {
			return parent.detail;
		}

		return error.message;
	}

	return undefined;
};

export function assertOrThrow<T>(
	value: T | null | undefined,
	code: AppErrorCode,
	message?: string,
): asserts value is T {
	if (value == null) {
		throw ApplicationError.from(code, message);
	}
}

export const sendAppError = (
	res: Response,
	code: AppErrorCode,
	message?: string,
) => {
	const definition = AppErrors[code];
	return sendResponse(
		res,
		definition.statusCode,
		definition.status,
		message ?? definition.message,
	);
};

export const sendSucceeded = (
	res: Response,
	code: AppSucceededCode,
	data?: unknown,
	message?: string,
) => {
	const definition = AppSucceeded[code];
	return sendResponse(
		res,
		definition.statusCode,
		definition.status,
		message ?? definition.message,
		data,
	);
};

export const handleError = (
	res: Response,
	error: unknown,
	fallback: AppErrorCode = "LOGIN_FAILED",
) => {
	if (error instanceof ApplicationError) {
		return sendResponse(res, error.statusCode, error.status, error.message);
	}

	const message = getUnderlyingErrorMessage(error);
	if (message) {
		const definition = AppErrors[fallback];
		return sendResponse(
			res,
			definition.statusCode,
			definition.status,
			message,
		);
	}

	return sendAppError(res, fallback);
};
