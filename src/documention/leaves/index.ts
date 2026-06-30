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

const leaveBody = {
	type: "object",
	required: ["leave_name", "start_date", "end_date"],
	properties: {
		leave_name: {
			type: "string",
			example: "Summer vacation",
		},
		start_date: {
			type: "string",
			format: "date",
		},
		end_date: {
			type: "string",
			format: "date",
		},
		reason: { type: "string" },
	},
};

const updateLeaveBody = {
	type: "object",
	properties: {
		leave_name: {
			type: "string",
			example: "Summer vacation",
		},
		start_date: {
			type: "string",
			format: "date",
		},
		end_date: {
			type: "string",
			format: "date",
		},
		reason: { type: "string" },
		statusId: {
			type: "string",
			format: "uuid",
			description: "Managers only.",
		},
	},
};

export default {
	"/api/v1/leaves": {
		get: {
			tags: ["Leaves"],
			summary: "List leave requests",
			description: "Managers see all requests; employees see only their own.",
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Leave records retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Leaves"],
			summary: "Submit leave request",
			description:
				"Create a leave request for the authenticated user using leave_name, start_date, end_date, and an optional reason.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: leaveBody } },
			},
			responses: standardWriteResponses,
		},
	},
	"/api/v1/leaves/{id}": {
		get: {
			tags: ["Leaves"],
			summary: "Get leave request by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardReadResponses,
		},
		patch: {
			tags: ["Leaves"],
			summary: "Update leave request",
			description:
				"Employees can update pending own requests; managers can update any. Uses the same fields as create.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: updateLeaveBody } },
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/leaves/{id}/approve": {
		patch: {
			tags: ["Leaves"],
			summary: "Approve leave request",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
	"/api/v1/leaves/{id}/reject": {
		patch: {
			tags: ["Leaves"],
			summary: "Reject leave request",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { reason: { type: "string" } },
						},
					},
				},
			},
			responses: standardMutationResponses,
		},
	},
	"/api/v1/leaves/{id}/cancel": {
		patch: {
			tags: ["Leaves"],
			summary: "Cancel leave request",
			description: "Employees can cancel their own pending requests.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};
