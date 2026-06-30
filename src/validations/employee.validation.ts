import Joi from "joi";

const uuidSchema = Joi.string().uuid({ version: "uuidv4" });

const dateOnlySchema = Joi.string()
	.pattern(/^\d{4}-\d{2}-\d{2}$/)
	.custom((value, helpers) => {
		const [yearStr, monthStr, dayStr] = value.split("-");
		const year = Number(yearStr);
		const month = Number(monthStr);
		const day = Number(dayStr);
		const date = new Date(year, month - 1, day);
		const normalized = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

		if (normalized !== value) {
			return helpers.error("any.invalid");
		}

		return value;
	})
	.messages({
		"string.pattern.base": "dateJoined must be a valid date in YYYY-MM-DD format",
		"any.invalid": "dateJoined must be a valid date in YYYY-MM-DD format",
	});

export const employeeIdParamSchema = Joi.object({
	id: uuidSchema.required().messages({
		"any.required": "id is required",
		"string.guid": "id must be a valid UUID",
	}),
});

export const listEmployeesQuerySchema = Joi.object({
	page: Joi.string().pattern(/^\d+$/).optional(),
	limit: Joi.string().pattern(/^\d+$/).optional(),
	search: Joi.string().trim().max(100).optional(),
	sortBy: Joi.string()
		.valid("firstName", "lastName", "email", "employeeCode", "dateJoined", "createdAt")
		.optional(),
	sortOrder: Joi.string().valid("ASC", "DESC").optional(),
	departmentId: uuidSchema.optional(),
	roleId: uuidSchema.optional(),
	statusId: uuidSchema.optional(),
	positionId: uuidSchema.optional(),
	employmentTypeId: uuidSchema.optional(),
	managerId: uuidSchema.optional(),
}).unknown(false);

export const createEmployeeSchema = Joi.object({
	firstName: Joi.string().trim().min(1).max(100).required().messages({
		"string.empty": "firstName is required",
		"any.required": "firstName is required",
	}),
	lastName: Joi.string().trim().min(1).max(100).required().messages({
		"string.empty": "lastName is required",
		"any.required": "lastName is required",
	}),
	email: Joi.string().trim().email().required().messages({
		"string.empty": "email is required",
		"string.email": "email must be a valid email address",
		"any.required": "email is required",
	}),
	phone: Joi.string().trim().max(30).allow(null, "").optional(),
	salary: Joi.number().min(0).optional(),
	profilePicture: Joi.string().trim().max(500).allow(null, "").optional(),
	address: Joi.string().trim().max(500).allow(null, "").optional(),
	emergencyContactName: Joi.string().trim().max(100).allow(null, "").optional(),
	emergencyContactPhone: Joi.string().trim().max(30).allow(null, "").optional(),
	emergencyContactRelation: Joi.string().trim().max(50).allow(null, "").optional(),
	dateJoined: dateOnlySchema.optional(),
	bankName: Joi.string().trim().max(100).optional(),
	accountNumber: Joi.number().integer().positive().optional(),
	accountName: Joi.string().trim().max(100).optional(),
}).unknown(false);

export const updateEmployeeSchema = Joi.object({
	phone: Joi.string().trim().max(30).allow(null, "").optional(),
	salary: Joi.number().min(0).optional(),
	profilePicture: Joi.string().trim().max(500).allow(null, "").optional(),
	address: Joi.string().trim().max(500).allow(null, "").optional(),
	emergencyContactName: Joi.string().trim().max(100).allow(null, "").optional(),
	emergencyContactPhone: Joi.string().trim().max(30).allow(null, "").optional(),
	emergencyContactRelation: Joi.string().trim().max(50).allow(null, "").optional(),
	dateJoined: dateOnlySchema.optional(),
})
	.min(1)
	.unknown(false);

export const assignEmployeeRoleSchema = Joi.object({
	roleId: uuidSchema.required().messages({
		"any.required": "roleId is required",
		"string.guid": "roleId must be a valid UUID",
	}),
}).unknown(false);

export const assignEmployeeDepartmentSchema = Joi.object({
	departmentId: uuidSchema.required().messages({
		"any.required": "departmentId is required",
		"string.guid": "departmentId must be a valid UUID",
	}),
}).unknown(false);

export const assignEmployeePositionSchema = Joi.object({
	positionId: uuidSchema.required().messages({
		"any.required": "positionId is required",
		"string.guid": "positionId must be a valid UUID",
	}),
}).unknown(false);

export const assignEmployeeManagerSchema = Joi.object({
	managerId: uuidSchema.required().messages({
		"any.required": "managerId is required",
		"string.guid": "managerId must be a valid UUID",
	}),
}).unknown(false);

export const assignEmployeeEmploymentTypeSchema = Joi.object({
	employmentTypeId: uuidSchema.required().messages({
		"any.required": "employmentTypeId is required",
		"string.guid": "employmentTypeId must be a valid UUID",
	}),
}).unknown(false);

export const assignEmployeeStatusSchema = Joi.object({
	statusId: uuidSchema.required().messages({
		"any.required": "statusId is required",
		"string.guid": "statusId must be a valid UUID",
	}),
}).unknown(false);
