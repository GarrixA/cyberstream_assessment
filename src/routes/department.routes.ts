import express from "express";
import * as departmentController from "../controllers/department.controller";
import { authenticate, requireAdmin, requirePermission } from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	assignDepartmentManagerSchema,
	assignDepartmentStatusSchema,
	createDepartmentSchema,
	departmentIdParamSchema,
	listDepartmentsQuerySchema,
	updateDepartmentSchema,
} from "../validations/department.validation";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("department.manage", "employee.read.all"),
	validate(listDepartmentsQuerySchema, "query"),
	departmentController.listDepartments,
);
router.post(
	"/",
	requirePermission("department.manage"),
	validate(createDepartmentSchema),
	departmentController.createDepartment,
);
router.get(
	"/:id",
	requirePermission("department.manage", "employee.read.all"),
	validate(departmentIdParamSchema, "params"),
	departmentController.getDepartment,
);
router.patch(
	"/:id",
	requirePermission("department.manage"),
	validate(departmentIdParamSchema, "params"),
	validate(updateDepartmentSchema),
	departmentController.updateDepartment,
);
router.patch(
	"/:id/assign-manager",
	requirePermission("department.manage"),
	validate(departmentIdParamSchema, "params"),
	validate(assignDepartmentManagerSchema),
	departmentController.assignDepartmentManager,
);
router.patch(
	"/:id/assign-status",
	requirePermission("department.manage"),
	validate(departmentIdParamSchema, "params"),
	validate(assignDepartmentStatusSchema),
	departmentController.assignDepartmentStatus,
);
router.patch(
	"/:id/deactivate",
	requireAdmin,
	validate(departmentIdParamSchema, "params"),
	departmentController.deactivateDepartment,
);

export default router;
