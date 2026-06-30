import express from "express";
import * as payrollController from "../controllers/payroll.controller";
import { authenticate, requirePermission } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);

router.get("/", requirePermission("payroll.manage"), payrollController.listPayroll);
router.post("/", requirePermission("payroll.manage"), payrollController.createPayroll);
router.get("/:id", requirePermission("payroll.manage"), payrollController.getPayroll);
router.patch("/:id", requirePermission("payroll.manage"), payrollController.updatePayroll);
router.delete("/:id", requirePermission("payroll.manage"), payrollController.deletePayroll);

export default router;
