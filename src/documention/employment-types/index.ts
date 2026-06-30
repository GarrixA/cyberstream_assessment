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

const employmentTypeBody = {
	type: "object",
	properties: {
		name: { type: "string", example: "Full-time" },
		description: { type: "string" },
	},
};

export default {
	"/api/v1/employment-types": {
		get: {
			tags: ["Employment Types"],
			summary: "List employment types",
			description: "Reference data for employee employment type selection.",
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Employment types retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Employment Types"],
			summary: "Create employment type",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: employmentTypeBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/employment-types/{id}": {
		get: {
			tags: ["Employment Types"],
			summary: "Get employment type by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Employment Types"],
			summary: "Update employment type",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: employmentTypeBody } },
			},
			responses: standardMutationResponses,
		},
		delete: {
			tags: ["Employment Types"],
			summary: "Delete employment type",
			description: "Fails if the employment type is assigned to employees.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};
