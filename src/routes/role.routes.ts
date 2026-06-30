import express from "express";
import * as roleController from "../controllers/role.controller";
import { authenticate, requireAdmin, requirePermission } from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	assignRolePermissionsSchema,
	assignRoleStatusSchema,
	createRoleSchema,
	updateRoleSchema,
} from "../validations/role.validation";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("role.manage", "employee.read.all"),
	roleController.listRoles,
);
router.post(
	"/",
	requireAdmin,
	validate(createRoleSchema),
	roleController.createRole,
);
router.get(
	"/:id",
	requirePermission("role.manage", "employee.read.all"),
	roleController.getRole,
);
router.patch(
	"/:id",
	requireAdmin,
	validate(updateRoleSchema),
	roleController.updateRole,
);
router.patch(
	"/:id/assign-permissions",
	requireAdmin,
	validate(assignRolePermissionsSchema),
	roleController.assignRolePermissions,
);
router.patch(
	"/:id/assign-status",
	requireAdmin,
	validate(assignRoleStatusSchema),
	roleController.assignRoleStatus,
);
router.delete("/:id", requireAdmin, roleController.deleteRole);

export default router;
