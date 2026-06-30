import express from "express";
import * as statusController from "../controllers/status.controller";
import { authenticate, requireAdmin } from "../middlewares/auth";
import { validate } from "../validations/validate";
import {
	createStatusSchema,
	updateStatusSchema,
} from "../validations/status.validation";

const router = express.Router();

router.use(authenticate);

router.get("/", statusController.listStatuses);
router.post(
	"/",
	requireAdmin,
	validate(createStatusSchema),
	statusController.createStatus,
);
router.get("/:id", statusController.getStatus);
router.patch(
	"/:id",
	requireAdmin,
	validate(updateStatusSchema),
	statusController.updateStatus,
);
router.delete("/:id", requireAdmin, statusController.deleteStatus);

export default router;
