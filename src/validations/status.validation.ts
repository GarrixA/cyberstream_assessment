import Joi from "joi";

const statusCategories = [
	"user",
	"role",
	"account",
	"position",
	"token",
	"department",
	"leave",
	"payroll",
] as const;

const statusNameSchema = Joi.string().trim().min(1).max(100).required().messages({
	"string.empty": "name is required",
	"any.required": "name is required",
});

const statusCategorySchema = Joi.string()
	.valid(...statusCategories)
	.required()
	.messages({
		"any.only": `category must be one of: ${statusCategories.join(", ")}`,
		"any.required": "category is required",
	});

export const createStatusSchema = Joi.object({
	name: statusNameSchema,
	category: statusCategorySchema,
	description: Joi.string().trim().max(500).allow(null, "").optional(),
});

export const updateStatusSchema = Joi.object({
	name: Joi.string().trim().min(1).max(100).optional(),
	category: Joi.string()
		.valid(...statusCategories)
		.optional()
		.messages({
			"any.only": `category must be one of: ${statusCategories.join(", ")}`,
		}),
	description: Joi.string().trim().max(500).allow(null, "").optional(),
}).min(1);
