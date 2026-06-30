import express from "express";
import * as leaveController from "../controllers/leave.controller";
import { authenticate, requirePermission } from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	createLeaveSchema,
	leaveIdParamSchema,
	listLeavesQuerySchema,
	rejectLeaveSchema,
	updateLeaveSchema,
} from "../validations/leave.validation";

const router = express.Router();

router.use(authenticate);

router.get(
	"/",
	requirePermission("leave.manage", "leave.read.own"),
	validate(listLeavesQuerySchema, "query"),
	leaveController.listLeaves,
);
router.post(
	"/",
	requirePermission("leave.manage", "leave.read.own"),
	validate(createLeaveSchema),
	leaveController.createLeave,
);
router.get(
	"/:id",
	requirePermission("leave.manage", "leave.read.own"),
	validate(leaveIdParamSchema, "params"),
	leaveController.getLeave,
);
router.patch(
	"/:id",
	requirePermission("leave.manage", "leave.read.own"),
	validate(leaveIdParamSchema, "params"),
	validate(updateLeaveSchema),
	leaveController.updateLeave,
);
router.patch(
	"/:id/approve",
	requirePermission("leave.manage"),
	validate(leaveIdParamSchema, "params"),
	leaveController.approveLeave,
);
router.patch(
	"/:id/reject",
	requirePermission("leave.manage"),
	validate(leaveIdParamSchema, "params"),
	validate(rejectLeaveSchema),
	leaveController.rejectLeave,
);
router.patch(
	"/:id/cancel",
	requirePermission("leave.manage", "leave.read.own"),
	validate(leaveIdParamSchema, "params"),
	leaveController.cancelLeave,
);

export default router;
