import Joi from "joi";

const nameSchema = Joi.string().trim().min(1).max(100).required().messages({
	"string.empty": "name is required",
	"any.required": "name is required",
});

export const createRoleSchema = Joi.object({
	name: nameSchema,
	description: Joi.string().trim().max(500).allow(null, "").optional(),
});

export const updateRoleSchema = Joi.object({
	name: Joi.string().trim().min(1).max(100).optional(),
	description: Joi.string().trim().max(500).allow(null, "").optional(),
}).min(1);

export const assignRolePermissionsSchema = Joi.object({
	permissionIds: Joi.array()
		.items(Joi.string().uuid({ version: "uuidv4" }))
		.required()
		.messages({
			"any.required": "permissionIds is required",
		}),
});

export const assignRoleStatusSchema = Joi.object({
	statusId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
		"any.required": "statusId is required",
	}),
});
