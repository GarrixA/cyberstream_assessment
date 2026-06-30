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

const statusCategories = [
	"user",
	"role",
	"account",
	"position",
	"token",
	"department",
	"leave",
	"payroll",
];

const statusBody = {
	type: "object",
	properties: {
		name: { type: "string", example: "Active" },
		category: { type: "string", enum: statusCategories },
		description: { type: "string" },
	},
};

const statusFilterParams = [
	...paginationParams,
	{
		name: "category",
		in: "query",
		schema: { type: "string", enum: statusCategories },
	},
];

export default {
	"/api/v1/statuses": {
		get: {
			tags: ["Statuses"],
			summary: "List statuses",
			description: "Supports pagination, search, and category filter.",
			security: bearerSecurity,
			parameters: statusFilterParams,
			responses: {
				200: {
					description: "Statuses retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				500: responses[500],
			},
		},
		post: {
			tags: ["Statuses"],
			summary: "Create status",
			description: "Admin only.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: statusBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/statuses/{id}": {
		get: {
			tags: ["Statuses"],
			summary: "Get status by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Statuses"],
			summary: "Update status",
			description: "Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: statusBody } },
			},
			responses: standardMutationResponses,
		},
		delete: {
			tags: ["Statuses"],
			summary: "Delete status",
			description: "Admin only. Fails if the status is referenced by other records.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};
