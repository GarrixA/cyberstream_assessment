import { DEPLOYED_URL, PORT, SERVER_URL } from "../utils/keys";

const basicInfo = {
	openapi: "3.0.0",
	info: {
		title: "CyberStream Employee Management API",
		description:
			"API for employee management, authentication, departments, positions, employment types, roles, attendance, leave, payroll, and audit logs.",
		version: "1.0.0",
	},
	servers: [
		{
			url: SERVER_URL || `http://localhost:${PORT}`,
			description: "Development server",
		},
		{
			url: DEPLOYED_URL,
			description: "Production server (HTTPS)",
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
	},
};

export default basicInfo;
