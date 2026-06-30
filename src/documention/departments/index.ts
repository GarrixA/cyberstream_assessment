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

const departmentBody = {
	type: "object",
	required: ["name"],
	properties: {
		name: { type: "string", example: "Engineering" },
		description: { type: "string" },
	},
};

const assignManagerBody = {
	type: "object",
	required: ["managerId"],
	properties: {
		managerId: { type: "string", format: "uuid" },
	},
};

const assignStatusBody = {
	type: "object",
	required: ["statusId"],
	properties: {
		statusId: { type: "string", format: "uuid" },
	},
};

export default {
	"/api/v1/departments": {
		get: {
			tags: ["Departments"],
			summary: "List departments",
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Departments retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Departments"],
			summary: "Create department",
			description: "HR and Admin only. New departments are created with Active status.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: departmentBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/departments/{id}": {
		get: {
			tags: ["Departments"],
			summary: "Get department by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Departments"],
			summary: "Update department",
			description: "HR and Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: departmentBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/departments/{id}/assign-manager": {
		patch: {
			tags: ["Departments"],
			summary: "Assign department manager",
			description: "HR and Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignManagerBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/departments/{id}/assign-status": {
		patch: {
			tags: ["Departments"],
			summary: "Assign status to department",
			description:
				"HR and Admin only. Status must have category `department`. Use the deactivate endpoint to set Inactive status.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignStatusBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/departments/{id}/deactivate": {
		patch: {
			tags: ["Departments"],
			summary: "Deactivate department",
			description: "Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};
