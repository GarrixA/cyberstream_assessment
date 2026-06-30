import Joi from "joi";

const permissionCodeSchema = Joi.string()
	.trim()
	.pattern(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/)
	.required()
	.messages({
		"string.pattern.base":
			"code must use lowercase dot notation (e.g. employee.create)",
		"any.required": "code is required",
	});

const permissionNameSchema = Joi.string().trim().min(1).max(100).required().messages({
	"string.empty": "name is required",
	"any.required": "name is required",
});

export const createPermissionSchema = Joi.object({
	code: permissionCodeSchema,
	name: permissionNameSchema,
	description: Joi.string().trim().max(500).allow(null, "").optional(),
});

export const updatePermissionSchema = Joi.object({
	code: Joi.string()
		.trim()
		.pattern(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/)
		.optional()
		.messages({
			"string.pattern.base":
				"code must use lowercase dot notation (e.g. employee.create)",
		}),
	name: Joi.string().trim().min(1).max(100).optional(),
	description: Joi.string().trim().max(500).allow(null, "").optional(),
}).min(1);
