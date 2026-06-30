import express from "express";
import * as employeeController from "../controllers/employee.controller";
import { authenticate, requirePermission } from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	assignEmployeeDepartmentSchema,
	assignEmployeeEmploymentTypeSchema,
	assignEmployeeManagerSchema,
	assignEmployeePositionSchema,
	assignEmployeeRoleSchema,
	assignEmployeeStatusSchema,
	createEmployeeSchema,
	employeeIdParamSchema,
	listEmployeesQuerySchema,
	updateEmployeeSchema,
} from "../validations/employee.validation";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("employee.read.all", "employee.read.team", "employee.read.own"),
	validate(listEmployeesQuerySchema, "query"),
	employeeController.listEmployees,
);
router.post(
	"/",
	requirePermission("employee.create"),
	validate(createEmployeeSchema),
	employeeController.createEmployee,
);
router.get(
	"/:id",
	requirePermission("employee.read.all", "employee.read.team", "employee.read.own"),
	validate(employeeIdParamSchema, "params"),
	employeeController.getEmployee,
);
router.patch(
	"/:id",
	requirePermission("employee.update", "employee.update.limited", "employee.update.own"),
	validate(employeeIdParamSchema, "params"),
	validate(updateEmployeeSchema),
	employeeController.updateEmployee,
);
router.patch(
	"/:id/assign-role",
	requirePermission("employee.update", "role.manage"),
	validate(employeeIdParamSchema, "params"),
	validate(assignEmployeeRoleSchema),
	employeeController.assignEmployeeRole,
);
router.patch(
	"/:id/assign-department",
	requirePermission("employee.update"),
	validate(employeeIdParamSchema, "params"),
	validate(assignEmployeeDepartmentSchema),
	employeeController.assignEmployeeDepartment,
);
router.patch(
	"/:id/assign-position",
	requirePermission("employee.update"),
	validate(employeeIdParamSchema, "params"),
	validate(assignEmployeePositionSchema),
	employeeController.assignEmployeePosition,
);
router.patch(
	"/:id/assign-manager",
	requirePermission("employee.update"),
	validate(employeeIdParamSchema, "params"),
	validate(assignEmployeeManagerSchema),
	employeeController.assignEmployeeManager,
);
router.patch(
	"/:id/assign-employment-type",
	requirePermission("employee.update"),
	validate(employeeIdParamSchema, "params"),
	validate(assignEmployeeEmploymentTypeSchema),
	employeeController.assignEmployeeEmploymentType,
);
router.patch(
	"/:id/assign-status",
	requirePermission("employee.update"),
	validate(employeeIdParamSchema, "params"),
	validate(assignEmployeeStatusSchema),
	employeeController.assignEmployeeStatus,
);
router.patch(
	"/:id/deactivate",
	requirePermission("employee.deactivate"),
	validate(employeeIdParamSchema, "params"),
	employeeController.deactivateEmployee,
);

export default router;
