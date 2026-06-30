import {
	bearerSecurity,
	paginationParams,
	standardMutationResponses,
	standardReadResponses,
	standardWriteResponses,
	uuidPathParam,
} from "../shared";
import { apiResponse } from "../schemas";
import { responses } from "../responses";

const createPayrollBody = {
	type: "object",
	required: ["userId"],
	properties: {
		userId: {
			type: "string",
			format: "uuid",
			description: "Employee to generate payroll for.",
		},
		notes: {
			type: "string",
			description: "Optional note. Defaults to the current pay period label.",
		},
	},
};

const updatePayrollBody = {
	type: "object",
	properties: {
		periodStart: { type: "string", format: "date" },
		periodEnd: { type: "string", format: "date" },
		grossSalary: { type: "number", example: 85000 },
		deductions: { type: "number", example: 5000 },
		netSalary: {
			type: "number",
			example: 80000,
			description: "Auto-calculated from grossSalary - deductions when omitted.",
		},
		statusId: { type: "string", format: "uuid" },
		notes: { type: "string" },
	},
};

export default {
	"/api/v1/payroll": {
		get: {
			tags: ["Payroll"],
			summary: "List payroll records",
			description: "HR and Admin only.",
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Payroll records retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Payroll"],
			summary: "Create payroll record",
			description:
				"HR and Admin only. Provide only userId. Pay period, gross salary, deductions, net salary, and status are calculated from the employee profile.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: createPayrollBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/payroll/{id}": {
		get: {
			tags: ["Payroll"],
			summary: "Get payroll record by ID",
			description: "HR and Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Payroll"],
			summary: "Update payroll record",
			description:
				"HR and Admin only. Update amounts, status (Pending/Processed/Paid), or notes.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: updatePayrollBody } },
			},
			responses: standardMutationResponses,
		},
		delete: {
			tags: ["Payroll"],
			summary: "Delete payroll record",
			description: "HR and Admin only. Only pending payroll records can be deleted.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};
