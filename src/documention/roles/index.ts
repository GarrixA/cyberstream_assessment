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

const roleBody = {
	type: "object",
	properties: {
		name: { type: "string", example: "Team Lead" },
		description: { type: "string" },
	},
};

const assignPermissionsBody = {
	type: "object",
	required: ["permissionIds"],
	properties: {
		permissionIds: {
			type: "array",
			items: { type: "string", format: "uuid" },
		},
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
	"/api/v1/roles": {
		get: {
			tags: ["Roles"],
			summary: "List roles and permissions",
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Roles retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Roles"],
			summary: "Create role",
			description: "Admin only.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: roleBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/roles/{id}": {
		get: {
			tags: ["Roles"],
			summary: "Get role by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Roles"],
			summary: "Update role",
			description: "Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: roleBody } },
			},
			responses: standardMutationResponses,
		},
		delete: {
			tags: ["Roles"],
			summary: "Delete role",
			description: "Admin only. Fails if the role is assigned to employees.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
	"/api/v1/roles/{id}/assign-permissions": {
		patch: {
			tags: ["Roles"],
			summary: "Assign permissions to role",
			description: "Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignPermissionsBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/roles/{id}/assign-status": {
		patch: {
			tags: ["Roles"],
			summary: "Assign status to role",
			description: "Admin only. Status must have category `role`.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignStatusBody } },
			},
			responses: standardMutationResponses,
		},
	},
};
