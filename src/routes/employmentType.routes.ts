import express from "express";
import * as employmentTypeController from "../controllers/employmentType.controller";
import { authenticate, requirePermission } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("department.manage", "employee.read.all"),
	employmentTypeController.listEmploymentTypes,
);
router.post(
	"/",
	requirePermission("department.manage"),
	employmentTypeController.createEmploymentType,
);
router.get(
	"/:id",
	requirePermission("department.manage", "employee.read.all"),
	employmentTypeController.getEmploymentType,
);
router.patch(
	"/:id",
	requirePermission("department.manage"),
	employmentTypeController.updateEmploymentType,
);
router.delete(
	"/:id",
	requirePermission("department.manage"),
	employmentTypeController.deleteEmploymentType,
);

export default router;
