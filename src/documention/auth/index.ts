import { apiResponse, bearerSecurity, errorResponse } from "../schemas";
import { authResponses, logoutResponses, responses } from "../responses";

const authPaths = {
	"/api/v1/auth/login": {
		post: {
			tags: ["Auth"],
			summary: "Employee login",
			description: "Authenticates an employee and records attendance on login.",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: ["email", "password"],
							properties: {
								email: {
									type: "string",
									format: "email",
									example: "john.admin@cyberstream.com",
								},
								password: { type: "string", example: "Password@123" },
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Login successful",
					content: {
						"application/json": {
							schema: {
								...apiResponse,
								properties: {
									...apiResponse.properties,
									data: {
										type: "object",
										properties: {
											token: { type: "string" },
											attendanceId: { type: "string", format: "uuid" },
											user: {
												type: "object",
												properties: {
													id: { type: "string", format: "uuid" },
													email: { type: "string" },
													firstName: { type: "string" },
													lastName: { type: "string" },
													role: { type: "string" },
													permissions: {
														type: "array",
														items: { type: "string" },
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
				401: authResponses[401],
				403: authResponses[403],
				500: authResponses[500],
			},
		},
	},
	"/api/v1/auth/logout": {
		post: {
			tags: ["Auth"],
			summary: "Employee logout",
			description:
				"Logs out the authenticated employee. Requires a valid, active access token in the Authorization header. On success, the token is marked as invalidated and the open attendance session is closed automatically.",
			security: bearerSecurity,
			responses: {
				200: logoutResponses[200],
				401: logoutResponses[401],
				500: logoutResponses[500],
			},
		},
	},
	"/api/v1/auth/forgot-password": {
		post: {
			tags: ["Auth"],
			summary: "Forgot password",
			description:
				"Sends a 6-digit reset code and a reset link with a JWT token (containing the code) to the user's email if the account exists.",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: ["email"],
							properties: {
								email: { type: "string", format: "email" },
							},
						},
					},
				},
			},
			responses: {
				200: responses[200],
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/reset-password": {
		get: {
			tags: ["Auth"],
			summary: "Verify reset password link",
			description:
				"Validates the reset token from the email link. Call this when the user lands on the frontend reset page with ?token= in the URL. Returns the reset code and email for the reset form.",
			parameters: [
				{
					name: "token",
					in: "query",
					required: true,
					schema: { type: "string" },
					description: "JWT reset token from the email link",
				},
			],
			responses: {
				200: {
					description: "Reset code verified",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									status: { type: "string", example: "SUCCESS" },
									message: { type: "string", example: "Reset code verified" },
									data: {
										type: "object",
										properties: {
											code: { type: "string", example: "123456" },
											email: {
												type: "string",
												format: "email",
												example: "jane.doe@cyberstream.com",
											},
											expiresAt: {
												type: "string",
												format: "date-time",
											},
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: "Invalid or expired reset token",
					...errorResponse(
						"BAD_REQUEST",
						"Invalid or expired reset code",
						"INVALID_RESET_TOKEN",
					),
				},
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/reset-password/{code}": {
		get: {
			tags: ["Auth"],
			summary: "Verify reset password code",
			description:
				"Validates a 6-digit reset code when the user enters it manually on the frontend.",
			parameters: [
				{
					name: "code",
					in: "path",
					required: true,
					schema: { type: "string", example: "123456" },
					description: "6-digit reset code from email",
				},
			],
			responses: {
				200: {
					description: "Reset code verified",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									status: { type: "string", example: "SUCCESS" },
									message: { type: "string", example: "Reset code verified" },
									data: {
										type: "object",
										properties: {
											code: { type: "string", example: "123456" },
											email: {
												type: "string",
												format: "email",
												example: "jane.doe@cyberstream.com",
											},
											expiresAt: {
												type: "string",
												format: "date-time",
											},
										},
									},
								},
							},
						},
					},
				},
				400: {
					description: "Invalid or expired reset code",
					...errorResponse(
						"BAD_REQUEST",
						"Invalid or expired reset code",
						"INVALID_RESET_TOKEN",
					),
				},
				500: responses[500],
			},
		},
		patch: {
			tags: ["Auth"],
			summary: "Reset password",
			description:
				"Resets the password using the 6-digit code from the reset email. The code is passed as a URL parameter. The reset link sent by email also includes a JWT token that contains the same code for the frontend.",
			parameters: [
				{
					name: "code",
					in: "path",
					required: true,
					schema: { type: "string", example: "123456" },
					description: "6-digit reset code from email",
				},
			],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: ["newPassword", "confirmNewPassword"],
							properties: {
								newPassword: { type: "string", example: "Password@123" },
								confirmNewPassword: {
									type: "string",
									example: "Password@123",
								},
							},
						},
					},
				},
			},
			responses: {
				200: responses[200],
				400: {
					description: "Invalid reset code or passwords do not match",
					...errorResponse(
						"BAD_REQUEST",
						"Invalid or expired reset code",
						"INVALID_RESET_TOKEN",
					),
				},
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/change-password": {
		patch: {
			tags: ["Auth"],
			summary: "Change password",
			security: bearerSecurity,
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							required: [
								"currentPassword",
								"newPassword",
								"confirmNewPassword",
							],
							properties: {
								currentPassword: { type: "string" },
								newPassword: { type: "string" },
								confirmNewPassword: { type: "string" },
							},
						},
					},
				},
			},
			responses: {
				200: responses[200],
				400: {
					description: "Invalid current password or passwords do not match",
					...errorResponse(
						"BAD_REQUEST",
						"Current password is incorrect",
						"INVALID_PASSWORD",
					),
				},
				401: responses[401],
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/users": {
		get: {
			tags: ["Auth"],
			summary: "List all users",
			description: "Admin only. Returns a paginated list of all users.",
			security: bearerSecurity,
			parameters: [
				{ name: "page", in: "query", schema: { type: "string" } },
				{ name: "limit", in: "query", schema: { type: "string" } },
				{ name: "search", in: "query", schema: { type: "string" } },
				{
					name: "roleId",
					in: "query",
					schema: { type: "string", format: "uuid" },
				},
				{
					name: "statusId",
					in: "query",
					schema: { type: "string", format: "uuid" },
				},
			],
			responses: {
				200: responses[200],
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/managers": {
		get: {
			tags: ["Auth"],
			summary: "List managers",
			description:
				"Admin or HR only. Returns a paginated list of active users with the Manager role.",
			security: bearerSecurity,
			parameters: [
				{ name: "page", in: "query", schema: { type: "string" } },
				{ name: "limit", in: "query", schema: { type: "string" } },
				{ name: "search", in: "query", schema: { type: "string" } },
				{
					name: "departmentId",
					in: "query",
					schema: { type: "string", format: "uuid" },
				},
				{
					name: "statusId",
					in: "query",
					schema: { type: "string", format: "uuid" },
				},
			],
			responses: {
				200: responses[200],
				401: responses[401],
				403: responses[403],
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/users/me": {
		get: {
			tags: ["Auth"],
			summary: "Get own profile",
			security: bearerSecurity,
			responses: {
				200: responses[200],
				401: responses[401],
				404: responses[404],
			},
		},
		patch: {
			tags: ["Auth"],
			summary: "Update own profile",
			description:
				"Users may update profile picture, phone, address, and emergency contact.",
			security: bearerSecurity,
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								profilePicture: { type: "string" },
								phone: { type: "string" },
								address: { type: "string" },
								emergencyContactName: { type: "string" },
								emergencyContactPhone: { type: "string" },
								emergencyContactRelation: { type: "string" },
							},
						},
					},
				},
			},
			responses: {
				200: responses[200],
				401: responses[401],
				403: responses[403],
			},
		},
	},
	"/api/v1/auth/users/{id}/activate": {
		patch: {
			tags: ["Auth"],
			summary: "Activate user",
			description:
				"Admin only. Sets the user status to Active so they can log in again.",
			security: bearerSecurity,
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: { type: "string", format: "uuid" },
				},
			],
			responses: {
				200: responses[200],
				400: responses[400],
				401: responses[401],
				403: responses[403],
				404: responses[404],
				500: responses[500],
			},
		},
	},
	"/api/v1/auth/users/{id}/deactivate": {
		patch: {
			tags: ["Auth"],
			summary: "Deactivate user",
			description:
				"Admin only. Sets the user status to Inactive and invalidates all active access tokens.",
			security: bearerSecurity,
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: { type: "string", format: "uuid" },
				},
			],
			responses: {
				200: responses[200],
				400: responses[400],
				401: responses[401],
				403: responses[403],
				404: responses[404],
				500: responses[500],
			},
		},
	},
};

export default authPaths;
