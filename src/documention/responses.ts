import { errorResponse, succeededResponse } from "./schemas";

const standardErrors = {
	401: {
		description: "Unauthorized",
		...errorResponse("UNAUTHORIZED", "Please login to continue", "UNAUTHORIZED"),
	},
	403: {
		description: "Forbidden",
		...errorResponse("FORBIDDEN", "Access denied", "FORBIDDEN"),
	},
	404: {
		description: "Not found",
		...errorResponse("NOT_FOUND", "Resource not found", "NOT_FOUND"),
	},
	400: {
		description: "Bad request",
		...errorResponse("BAD_REQUEST", "Invalid request", "BAD_REQUEST"),
	},
	500: {
		description: "Server error",
		...errorResponse("ERROR", "Internal server error", "ERROR"),
	},
};

const standardSucceeded = {
	200: {
		description: "Success",
		...succeededResponse("SUCCESS", "Operation completed successfully"),
	},
	201: {
		description: "Created successfully",
		...succeededResponse("CREATED", "Resource created successfully", "EMPLOYEE_CREATED"),
	},
};

export const responses = {
	...standardSucceeded,
	...standardErrors,
};

export const authResponses = {
	200: {
		description: "Login successful",
		...succeededResponse("SUCCESS", "Login successful", "LOGIN_SUCCESS"),
	},
	401: {
		description: "Invalid credentials or unauthorized",
		...errorResponse("UNAUTHORIZED", "Invalid email or password", "INVALID_CREDENTIALS"),
	},
	403: {
		description: "Account inactive",
		...errorResponse("FORBIDDEN", "Your account is not active", "ACCOUNT_INACTIVE"),
	},
	500: responses[500],
};

export const logoutResponses = {
	200: {
		description: "Logout successful — the access token is invalidated and can no longer be used",
		...succeededResponse("SUCCESS", "Logout successful", "LOGOUT_SUCCESS"),
	},
	401: {
		description:
			"Not authenticated. Possible codes: UNAUTHORIZED (missing or invalid session), INVALID_TOKEN (malformed JWT or unknown token), SESSION_EXPIRED (token already invalidated)",
		...errorResponse("UNAUTHORIZED", "Please login to continue", "UNAUTHORIZED"),
	},
	500: {
		description: "Logout failed",
		...errorResponse("ERROR", "Logout failed", "LOGOUT_FAILED"),
	},
};

export const succeededResponses = standardSucceeded;
export const errorResponses = standardErrors;
