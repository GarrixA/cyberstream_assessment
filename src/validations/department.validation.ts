import Joi from "joi";

const uuidSchema = Joi.string().uuid({ version: "uuidv4" });

const nameSchema = Joi.string().trim().min(1).max(100).required().messages({
	"string.empty": "name is required",
	"any.required": "name is required",
});

export const departmentIdParamSchema = Joi.object({
	id: uuidSchema.required().messages({
		"any.required": "id is required",
		"string.guid": "id must be a valid UUID",
	}),
});

export const listDepartmentsQuerySchema = Joi.object({
	page: Joi.string().pattern(/^\d+$/).optional(),
	limit: Joi.string().pattern(/^\d+$/).optional(),
	search: Joi.string().trim().max(100).optional(),
	sortBy: Joi.string().valid("name", "createdAt").optional(),
	sortOrder: Joi.string().valid("ASC", "DESC").optional(),
}).unknown(false);

export const createDepartmentSchema = Joi.object({
	name: nameSchema,
	description: Joi.string().trim().max(500).allow(null, "").optional(),
}).unknown(false);

export const updateDepartmentSchema = Joi.object({
	name: Joi.string().trim().min(1).max(100).optional(),
	description: Joi.string().trim().max(500).allow(null, "").optional(),
})
	.min(1)
	.unknown(false);

export const assignDepartmentManagerSchema = Joi.object({
	managerId: uuidSchema.required().messages({
		"any.required": "managerId is required",
		"string.guid": "managerId must be a valid UUID",
	}),
}).unknown(false);

export const assignDepartmentStatusSchema = Joi.object({
	statusId: uuidSchema.required().messages({
		"any.required": "statusId is required",
		"string.guid": "statusId must be a valid UUID",
	}),
}).unknown(false);
