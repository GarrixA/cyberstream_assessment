import {
	bearerSecurity,
	paginationParams,
	standardMutationResponses,
	uuidPathParam,
} from "../shared";
import { apiResponse } from "../schemas";
import { responses } from "../responses";

const employeeCreateBody = {
	type: "object",
	required: ["firstName", "lastName", "email"],
	properties: {
		firstName: { type: "string", example: "Garrix" },
		lastName: { type: "string", example: "Me" },
		email: { type: "string", format: "email", example: "garrixme@gmail.com" },
		phone: { type: "string" },
		salary: { type: "number", example: 70000 },
		profilePicture: { type: "string" },
		address: { type: "string" },
		emergencyContactName: { type: "string" },
		emergencyContactPhone: { type: "string" },
		emergencyContactRelation: { type: "string" },
		dateJoined: { type: "string", format: "date" },
		bankName: { type: "string" },
		accountNumber: { type: "number", example: 1234567890 },
		accountName: { type: "string" },
	},
};

const employeeUpdateBody = {
	type: "object",
	properties: {
		phone: { type: "string" },
		salary: { type: "number", example: 70000 },
		profilePicture: { type: "string" },
		address: { type: "string" },
		emergencyContactName: { type: "string" },
		emergencyContactPhone: { type: "string" },
		emergencyContactRelation: { type: "string" },
		dateJoined: { type: "string", format: "date" },
	},
};

const assignRoleBody = {
	type: "object",
	required: ["roleId"],
	properties: {
		roleId: {
			type: "string",
			format: "uuid",
			description: "Role ID from GET /roles.",
		},
	},
};

const assignDepartmentBody = {
	type: "object",
	required: ["departmentId"],
	properties: {
		departmentId: {
			type: "string",
			format: "uuid",
			description: "Use GET /departments to list valid IDs.",
		},
	},
};

const assignPositionBody = {
	type: "object",
	required: ["positionId"],
	properties: {
		positionId: {
			type: "string",
			format: "uuid",
			description: "Use GET /positions to list valid IDs.",
		},
	},
};

const assignManagerBody = {
	type: "object",
	required: ["managerId"],
	properties: {
		managerId: {
			type: "string",
			format: "uuid",
			description: "Existing employee ID from GET /employees.",
		},
	},
};

const assignEmploymentTypeBody = {
	type: "object",
	required: ["employmentTypeId"],
	properties: {
		employmentTypeId: {
			type: "string",
			format: "uuid",
			description: "Use GET /employment-types to list valid IDs.",
		},
	},
};

const assignStatusBody = {
	type: "object",
	required: ["statusId"],
	properties: {
		statusId: {
			type: "string",
			format: "uuid",
			description: "User status from GET /statuses?category=user.",
		},
	},
};

const employeeFilterParams = [
	...paginationParams,
	{ name: "departmentId", in: "query", schema: { type: "string", format: "uuid" } },
	{ name: "roleId", in: "query", schema: { type: "string", format: "uuid" } },
	{ name: "statusId", in: "query", schema: { type: "string", format: "uuid" } },
	{ name: "positionId", in: "query", schema: { type: "string", format: "uuid" } },
	{
		name: "employmentTypeId",
		in: "query",
		schema: { type: "string", format: "uuid" },
	},
	{ name: "managerId", in: "query", schema: { type: "string", format: "uuid" } },
];

const assignResponses = {
	200: {
		description: "Assignment successful",
		content: { "application/json": { schema: apiResponse } },
	},
	400: responses[400],
	401: responses[401],
	403: responses[403],
	404: responses[404],
};

const employeePaths = {
	"/api/v1/employees": {
		get: {
			tags: ["Employees"],
			summary: "List employees",
			description: "Supports pagination, search, filter, and sort.",
			security: bearerSecurity,
			parameters: employeeFilterParams,
			responses: {
				200: {
					description: "Employees retrieved",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
		post: {
			tags: ["Employees"],
			summary: "Create employee",
			description:
				"Creates an employee with an auto-generated employee code and temporary password. Role, department, position, manager, employment type, and status are assigned via separate endpoints.",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: { "application/json": { schema: employeeCreateBody } },
			},
			responses: {
				201: {
					description: "Employee created with auto-generated employeeCode and temporaryPassword in data",
					content: { "application/json": { schema: apiResponse } },
				},
				400: responses[400],
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
	},
	"/api/v1/employees/{id}": {
		get: {
			tags: ["Employees"],
			summary: "Get employee by ID",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: {
				200: responses[200],
				401: responses[401],
				403: responses[403],
				404: responses[404],
			},
		},
		patch: {
			tags: ["Employees"],
			summary: "Update employee",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				content: { "application/json": { schema: employeeUpdateBody } },
			},
			responses: {
				200: responses[200],
				401: responses[401],
				403: responses[403],
				404: responses[404],
			},
		},
	},
	"/api/v1/employees/{id}/assign-role": {
		patch: {
			tags: ["Employees"],
			summary: "Assign role to employee",
			description: "Requires employee.update and role.manage permissions.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignRoleBody } },
			},
			responses: assignResponses,
		},
	},
	"/api/v1/employees/{id}/assign-department": {
		patch: {
			tags: ["Employees"],
			summary: "Assign department to employee",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignDepartmentBody } },
			},
			responses: assignResponses,
		},
	},
	"/api/v1/employees/{id}/assign-position": {
		patch: {
			tags: ["Employees"],
			summary: "Assign position to employee",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignPositionBody } },
			},
			responses: assignResponses,
		},
	},
	"/api/v1/employees/{id}/assign-manager": {
		patch: {
			tags: ["Employees"],
			summary: "Assign manager to employee",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignManagerBody } },
			},
			responses: assignResponses,
		},
	},
	"/api/v1/employees/{id}/assign-employment-type": {
		patch: {
			tags: ["Employees"],
			summary: "Assign employment type to employee",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignEmploymentTypeBody } },
			},
			responses: assignResponses,
		},
	},
	"/api/v1/employees/{id}/assign-status": {
		patch: {
			tags: ["Employees"],
			summary: "Assign status to employee",
			description: "Use deactivate endpoint to set Inactive status.",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			requestBody: {
				required: true,
				content: { "application/json": { schema: assignStatusBody } },
			},
			responses: assignResponses,
		},
	},
	"/api/v1/employees/{id}/deactivate": {
		patch: {
			tags: ["Employees"],
			summary: "Deactivate employee",
			security: bearerSecurity,
			parameters: [uuidPathParam],
			responses: standardMutationResponses,
		},
	},
};

export default employeePaths;
