import { bearerSecurity, paginationParams, standardReadResponses, uuidPathParam } from "../shared";
import { apiResponse } from "../schemas";
import { responses } from "../responses";

export default {
	"/api/v1/permissions": {
		get: {
			tags: ["Permissions"],
			summary: "List permissions",
			description:
				"Read-only catalog of permission codes assigned to roles. Mutations are not exposed in this API.",
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Permissions retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
	},
	"/api/v1/permissions/{id}": {
		get: {
			tags: ["Permissions"],
			summary: "Get permission by ID",
			description: "Read-only. Returns a single permission from the catalog.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
	},
};
