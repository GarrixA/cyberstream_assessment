import express from "express";
import * as permissionController from "../controllers/permission.controller";
import { authenticate, requireAdmin, requirePermission } from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	createPermissionSchema,
	updatePermissionSchema,
} from "../validations/permission.validation";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("permission.manage", "role.manage"),
	permissionController.listPermissions,
);
router.post(
	"/",
	requireAdmin,
	validate(createPermissionSchema),
	permissionController.createPermission,
);
router.get(
	"/:id",
	requirePermission("permission.manage", "role.manage"),
	permissionController.getPermission,
);
router.patch(
	"/:id",
	requireAdmin,
	validate(updatePermissionSchema),
	permissionController.updatePermission,
);
router.delete("/:id", requireAdmin, permissionController.deletePermission);

export default router;
