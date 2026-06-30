import express from "express";
import * as positionController from "../controllers/position.controller";
import {
	authenticate,
	requireAdmin,
	requireAdminOrHr,
	requirePermission,
} from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	assignPositionDepartmentSchema,
	assignPositionStatusSchema,
	createPositionSchema,
	listPositionsQuerySchema,
	positionIdParamSchema,
	updatePositionSchema,
} from "../validations/position.validation";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("department.manage", "employee.read.all"),
	validate(listPositionsQuerySchema, "query"),
	positionController.listPositions,
);
router.post(
	"/",
	requireAdminOrHr,
	validate(createPositionSchema),
	positionController.createPosition,
);
router.get(
	"/:id",
	requirePermission("department.manage", "employee.read.all"),
	validate(positionIdParamSchema, "params"),
	positionController.getPosition,
);
router.patch(
	"/:id",
	requireAdminOrHr,
	validate(positionIdParamSchema, "params"),
	validate(updatePositionSchema),
	positionController.updatePosition,
);
router.patch(
	"/:id/assign-department",
	requireAdminOrHr,
	validate(positionIdParamSchema, "params"),
	validate(assignPositionDepartmentSchema),
	positionController.assignPositionDepartment,
);
router.patch(
	"/:id/assign-status",
	requireAdminOrHr,
	validate(positionIdParamSchema, "params"),
	validate(assignPositionStatusSchema),
	positionController.assignPositionStatus,
);
router.patch(
	"/:id/deactivate",
	requireAdmin,
	validate(positionIdParamSchema, "params"),
	positionController.deactivatePosition,
);

export default router;
