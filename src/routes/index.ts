import express from "express";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";
import departmentRoutes from "./department.routes";
import roleRoutes from "./role.routes";
import statusRoutes from "./status.routes";
import permissionRoutes from "./permission.routes";
import auditRoutes from "./audit.routes";
import attendanceRoutes from "./attendance.routes";
import leaveRoutes from "./leave.routes";
import payrollRoutes from "./payroll.routes";
import positionRoutes from "./position.routes";
import employmentTypeRoutes from "./employmentType.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/statuses", statusRoutes);
router.use("/permissions", permissionRoutes);
router.use("/audit-logs", auditRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
router.use("/payroll", payrollRoutes);
router.use("/positions", positionRoutes);
router.use("/employment-types", employmentTypeRoutes);

export default router;
