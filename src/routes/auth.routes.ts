import express from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate, requireAdmin, requireAdminOrHr, requirePermission } from "../middlewares/auth";
import { validate } from "../validations/validate";
import { updateEmployeeSchema } from "../validations/employee.validation";
import {
	changePasswordSchema,
	forgotPasswordSchema,
	listManagersQuerySchema,
	listUsersQuerySchema,
	loginSchema,
	resetPasswordCodeParamSchema,
	resetPasswordSchema,
	userIdParamSchema,
	verifyResetPasswordQuerySchema,
} from "../validations/auth.validation";

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.post(
	"/forgot-password",
	validate(forgotPasswordSchema),
	authController.forgotPassword,
);
router.get(
	"/reset-password",
	validate(verifyResetPasswordQuerySchema, "query"),
	authController.verifyResetPassword,
);
router.get(
	"/reset-password/:code",
	validate(resetPasswordCodeParamSchema, "params"),
	authController.verifyResetPassword,
);
router.patch(
	"/reset-password/:code",
	validate(resetPasswordCodeParamSchema, "params"),
	validate(resetPasswordSchema),
	authController.resetPassword,
);
router.patch(
	"/change-password",
	authenticate,
	validate(changePasswordSchema),
	authController.changePassword,
);
router.get(
	"/users",
	authenticate,
	requireAdmin,
	validate(listUsersQuerySchema, "query"),
	authController.listUsers,
);
router.get("/users/me", authenticate, authController.getMyProfile);
router.patch(
	"/users/me",
	authenticate,
	requirePermission("employee.update.own"),
	validate(updateEmployeeSchema),
	authController.updateMyProfile,
);
router.get(
	"/managers",
	authenticate,
	requireAdminOrHr,
	validate(listManagersQuerySchema, "query"),
	authController.listManagers,
);
router.patch(
	"/users/:id/activate",
	authenticate,
	requireAdmin,
	validate(userIdParamSchema, "params"),
	authController.activateUser,
);
router.patch(
	"/users/:id/deactivate",
	authenticate,
	requireAdmin,
	validate(userIdParamSchema, "params"),
	authController.deactivateUser,
);

export default router;
