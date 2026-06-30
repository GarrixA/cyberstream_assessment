import { responses } from "../responses";

export const health = {
	"/health": {
		get: {
			tags: ["Health"],
			summary: "Health check",
			responses: {
				200: {
					...responses[200],
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									status: { type: "string", example: "ok" },
									message: {
										type: "string",
										example: "CyberStream is running",
									},
								},
							},
						},
					},
				},
			},
		},
	},
};

export const root = {
	"/api/v1": {
		get: {
			tags: ["Root"],
			summary: "API welcome message",
			responses: {
				200: {
					...responses[200],
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "Welcome to CyberStream Employee Management API",
									},
								},
							},
						},
					},
				},
			},
		},
	},
};
