import express from "express";
import * as employeeController from "../controllers/employee.controller";
import { authenticate, requirePermission } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);
router.get("/", requirePermission("audit.read"), employeeController.listAuditLogs);

export default router;
