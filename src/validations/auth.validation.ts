import Joi from "joi";

const emailSchema = Joi.string().trim().email().required().messages({
	"string.empty": "email is required",
	"string.email": "email must be a valid email address",
	"any.required": "email is required",
});

const passwordSchema = Joi.string().min(8).max(128).required().messages({
	"string.empty": "password is required",
	"string.min": "password must be at least 8 characters",
	"any.required": "password is required",
});

const newPasswordSchema = Joi.string().min(8).max(128).required().messages({
	"string.empty": "newPassword is required",
	"string.min": "newPassword must be at least 8 characters",
	"any.required": "newPassword is required",
});

const resetCodeSchema = Joi.string().pattern(/^\d{6}$/).required().messages({
	"string.pattern.base": "code must be a 6-digit number",
	"any.required": "code is required",
});

export const loginSchema = Joi.object({
	email: emailSchema,
	password: passwordSchema,
}).unknown(false);

export const forgotPasswordSchema = Joi.object({
	email: emailSchema,
}).unknown(false);

export const verifyResetPasswordQuerySchema = Joi.object({
	token: Joi.string().trim().min(1).required().messages({
		"string.empty": "Token is required",
		"any.required": "Token is required",
	}),
}).unknown(false);

export const resetPasswordCodeParamSchema = Joi.object({
	code: resetCodeSchema,
});

export const resetPasswordSchema = Joi.object({
	newPassword: newPasswordSchema,
	confirmNewPassword: Joi.string()
		.valid(Joi.ref("newPassword"))
		.required()
		.messages({
			"any.only": "newPassword and confirmNewPassword must match",
			"any.required": "confirmNewPassword is required",
		}),
}).unknown(false);

const uuidSchema = Joi.string().uuid({ version: "uuidv4" });

export const userIdParamSchema = Joi.object({
	id: uuidSchema.required().messages({
		"any.required": "id is required",
		"string.guid": "id must be a valid UUID",
	}),
});

export const listUsersQuerySchema = Joi.object({
	page: Joi.string().pattern(/^\d+$/).optional(),
	limit: Joi.string().pattern(/^\d+$/).optional(),
	search: Joi.string().trim().max(100).optional(),
	roleId: uuidSchema.optional(),
	statusId: uuidSchema.optional(),
}).unknown(false);

export const listManagersQuerySchema = Joi.object({
	page: Joi.string().pattern(/^\d+$/).optional(),
	limit: Joi.string().pattern(/^\d+$/).optional(),
	search: Joi.string().trim().max(100).optional(),
	departmentId: uuidSchema.optional(),
	statusId: uuidSchema.optional(),
}).unknown(false);

export const changePasswordSchema = Joi.object({
	currentPassword: passwordSchema.messages({
		"string.empty": "currentPassword is required",
		"any.required": "currentPassword is required",
	}),
	newPassword: newPasswordSchema,
	confirmNewPassword: Joi.string()
		.valid(Joi.ref("newPassword"))
		.required()
		.messages({
			"any.only": "newPassword and confirmNewPassword must match",
			"any.required": "confirmNewPassword is required",
		}),
}).unknown(false);
