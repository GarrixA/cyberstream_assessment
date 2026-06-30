export const apiResponse = {
	type: "object",
	properties: {
		status: { type: "string", example: "SUCCESS" },
		message: { type: "string", example: "Operation completed successfully" },
		data: { type: "object" },
	},
};

export const succeededResponse = (
	status: string,
	message: string,
	code?: string,
) => ({
	content: {
		"application/json": {
			schema: {
				type: "object",
				properties: {
					status: { type: "string", example: status },
					message: { type: "string", example: message },
					data: { type: "object" },
					...(code ? { code: { type: "string", example: code } } : {}),
				},
			},
		},
	},
});

export const errorResponse = (status: string, message: string, code?: string) => ({
	content: {
		"application/json": {
			schema: {
				type: "object",
				properties: {
					status: { type: "string", example: status },
					message: { type: "string", example: message },
					...(code ? { code: { type: "string", example: code } } : {}),
				},
			},
		},
	},
});

export const paginationParams = [
	{ name: "page", in: "query", schema: { type: "integer", default: 1 } },
	{ name: "limit", in: "query", schema: { type: "integer", default: 10 } },
	{ name: "search", in: "query", schema: { type: "string" } },
	{ name: "sortBy", in: "query", schema: { type: "string" } },
	{
		name: "sortOrder",
		in: "query",
		schema: { type: "string", enum: ["ASC", "DESC"], default: "DESC" },
	},
];

export const bearerSecurity = [{ bearerAuth: [] }];
