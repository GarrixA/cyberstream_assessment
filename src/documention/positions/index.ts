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

const positionBody = {
	type: "object",
	properties: {
		title: { type: "string", example: "Software Engineer" },
		description: { type: "string" },
	},
};

const assignDepartmentBody = {
	type: "object",
	required: ["departmentId"],
	properties: {
		departmentId: { type: "string", format: "uuid" },
	},
};

const assignStatusBody = {
	type: "object",
	required: ["statusId"],
	properties: {
		statusId: { type: "string", format: "uuid" },
	},
};

const positionFilterParams = [
	...paginationParams,
	{
		name: "departmentId",
		in: "query",
		schema: { type: "string", format: "uuid" },
	},
];

export default {
	"/api/v1/positions": {
		get: {
			tags: ["Positions"],
			summary: "List positions",
			description: "Supports pagination, search, and department filter.",
			security: bearerSecurity,
			parameters: positionFilterParams,
			responses: {
				200: {
					description: "Positions retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Positions"],
			summary: "Create position",
			description: "Admin or HR only.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: positionBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/positions/{id}": {
		get: {
			tags: ["Positions"],
			summary: "Get position by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Positions"],
			summary: "Update position",
			description: "Admin or HR only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: positionBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/positions/{id}/assign-department": {
		patch: {
			tags: ["Positions"],
			summary: "Assign department to position",
			description: "Admin or HR only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignDepartmentBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/positions/{id}/assign-status": {
		patch: {
			tags: ["Positions"],
			summary: "Assign status to position",
			description:
				"Admin or HR only. Status must have category `position`. HR cannot assign Inactive; admins may assign Inactive here or use the deactivate endpoint.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignStatusBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/positions/{id}/deactivate": {
		patch: {
			tags: ["Positions"],
			summary: "Deactivate position",
			description: "Admin only.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};
