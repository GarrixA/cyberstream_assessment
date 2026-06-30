import Joi from "joi";

const uuidSchema = Joi.string().uuid({ version: "uuidv4" });

const titleSchema = Joi.string().trim().min(1).max(100).required().messages({
	"string.empty": "title is required",
	"any.required": "title is required",
});

export const positionIdParamSchema = Joi.object({
	id: uuidSchema.required().messages({
		"any.required": "id is required",
		"string.guid": "id must be a valid UUID",
	}),
});

export const listPositionsQuerySchema = Joi.object({
	page: Joi.string().pattern(/^\d+$/).optional(),
	limit: Joi.string().pattern(/^\d+$/).optional(),
	search: Joi.string().trim().max(100).optional(),
	departmentId: uuidSchema.optional(),
	sortBy: Joi.string().valid("title", "createdAt").optional(),
	sortOrder: Joi.string().valid("ASC", "DESC").optional(),
}).unknown(false);

export const createPositionSchema = Joi.object({
	title: titleSchema,
	description: Joi.string().trim().max(500).allow(null, "").optional(),
}).unknown(false);

export const updatePositionSchema = Joi.object({
	title: Joi.string().trim().min(1).max(100).optional(),
	description: Joi.string().trim().max(500).allow(null, "").optional(),
})
	.min(1)
	.unknown(false);

export const assignPositionDepartmentSchema = Joi.object({
	departmentId: uuidSchema.required().messages({
		"any.required": "departmentId is required",
		"string.guid": "departmentId must be a valid UUID",
	}),
}).unknown(false);

export const assignPositionStatusSchema = Joi.object({
	statusId: uuidSchema.required().messages({
		"any.required": "statusId is required",
		"string.guid": "statusId must be a valid UUID",
	}),
}).unknown(false);
