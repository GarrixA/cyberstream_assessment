import { apiResponse, bearerSecurity, paginationParams } from "../schemas";
import { responses } from "../responses";

const listPath = (tag: string, path: string, summary: string) => ({
	[path]: {
		get: {
			tags: [tag],
			summary,
			security: bearerSecurity,
			parameters: paginationParams,
			responses: {
				200: {
					description: "Success",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
	},
});

const attendanceDateParams = [
	{
		name: "date",
		in: "query",
		description: "Filter attendance for a single day (YYYY-MM-DD)",
		schema: { type: "string", format: "date" },
	},
	{
		name: "startDate",
		in: "query",
		description:
			"Start of date range (YYYY-MM-DD). Defaults to today when omitted.",
		schema: { type: "string", format: "date" },
	},
	{
		name: "endDate",
		in: "query",
		description:
			"End of date range (YYYY-MM-DD). Defaults to today when omitted.",
		schema: { type: "string", format: "date" },
	},
];

export default {
	...listPath(
		"Audit Logs",
		"/api/v1/audit-logs",
		"List audit logs including login and logout events",
	),
	"/api/v1/attendance": {
		get: {
			tags: ["Attendance"],
			summary: "List attendance records",
			description:
				"Returns attendance sessions filtered by day or date range. When no date query parameters are provided, results default to today.",
			security: bearerSecurity,
			parameters: [...paginationParams, ...attendanceDateParams],
			responses: {
				200: {
					description: "Success",
					content: { "application/json": { schema: apiResponse } },
				},
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
	},
};
