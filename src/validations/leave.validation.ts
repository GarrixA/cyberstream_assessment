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
		"string.pattern.base": "must be a valid date in YYYY-MM-DD format",
		"any.invalid": "must be a valid date in YYYY-MM-DD format",
	});

const assertEndDateOnOrAfterStartDate = (
	value: { start_date?: string; end_date?: string },
	helpers: Joi.CustomHelpers,
) => {
	if (value.start_date && value.end_date && value.end_date < value.start_date) {
		return helpers.message({
			custom: "end_date must be on or after start_date",
		});
	}

	return value;
};

export const leaveIdParamSchema = Joi.object({
	id: uuidSchema.required().messages({
		"any.required": "id is required",
		"string.guid": "id must be a valid UUID",
	}),
});

export const listLeavesQuerySchema = Joi.object({
	page: Joi.string().pattern(/^\d+$/).optional(),
	limit: Joi.string().pattern(/^\d+$/).optional(),
	search: Joi.string().trim().max(100).optional(),
}).unknown(false);

export const createLeaveSchema = Joi.object({
	leave_name: Joi.string().trim().min(1).max(100).required().messages({
		"string.empty": "leave_name is required",
		"any.required": "leave_name is required",
	}),
	start_date: dateOnlySchema.required().messages({
		"any.required": "start_date is required",
	}),
	end_date: dateOnlySchema.required().messages({
		"any.required": "end_date is required",
	}),
	reason: Joi.string().trim().max(500).allow(null, "").optional(),
})
	.unknown(false)
	.custom(assertEndDateOnOrAfterStartDate);

export const updateLeaveSchema = Joi.object({
	leave_name: Joi.string().trim().min(1).max(100).optional(),
	start_date: dateOnlySchema.optional(),
	end_date: dateOnlySchema.optional(),
	reason: Joi.string().trim().max(500).allow(null, "").optional(),
	statusId: uuidSchema.optional().messages({
		"string.guid": "statusId must be a valid UUID",
	}),
})
	.min(1)
	.unknown(false)
	.custom(assertEndDateOnOrAfterStartDate);

export const rejectLeaveSchema = Joi.object({
	reason: Joi.string().trim().max(500).allow(null, "").optional(),
}).unknown(false);
