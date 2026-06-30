import {
	API,
	CREDENTIALS,
	DEMO_PASSWORD,
	USERS,
	api,
	authHeader,
	login,
} from "./helpers";

jest.setTimeout(30000);

describe("AUTH API TEST", () => {
	it("should reject invalid login credentials", async () => {
		const { body } = await api
			.post(`${API}/auth/login`)
			.send({ email: CREDENTIALS.admin.email, password: "wrong-password" })
			.expect(401);

		expect(body.status).toBe("UNAUTHORIZED");
		expect(body.message).toBe("Invalid email or password");
	});

	it("should reject login without email", async () => {
		const { body } = await api
			.post(`${API}/auth/login`)
			.send({ password: DEMO_PASSWORD })
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("email is required");
	});

	it("should reject login with invalid email format", async () => {
		const { body } = await api
			.post(`${API}/auth/login`)
			.send({ email: "not-an-email", password: DEMO_PASSWORD })
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("email must be a valid email address");
	});

	it("should login successfully", async () => {
		const { body } = await api
			.post(`${API}/auth/login`)
			.send(CREDENTIALS.admin)
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Login successful");
		expect(body.data.token).toBeDefined();
		expect(body.data.user.email).toBe(CREDENTIALS.admin.email);
	});

	it("should record login in audit logs", async () => {
		await api.post(`${API}/auth/login`).send(CREDENTIALS.admin).expect(200);
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.get(`${API}/audit-logs?search=logged%20in`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(
			body.data.logs.some(
				(log: { action: string; description: string }) =>
					log.action === "logged_in" && log.description.includes("logged in"),
			),
		).toBe(true);
	});

	it("should send forgot password response", async () => {
		const { body } = await api
			.post(`${API}/auth/forgot-password`)
			.send({ email: CREDENTIALS.employee.email })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("If the email exists, a reset code has been sent");
		if (
			process.env.NODE_ENV === "test" ||
			process.env.DEV_MODE === "development"
		) {
			expect(body.data.resetCode).toBeDefined();
			expect(body.data.resetCode).toMatch(/^\d{6}$/);
			expect(body.data.resetToken).toBeDefined();
		}
	});

	it("should reject forgot password with invalid email", async () => {
		const { body } = await api
			.post(`${API}/auth/forgot-password`)
			.send({ email: "invalid-email" })
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("email must be a valid email address");
	});

	it("should verify reset password with email token", async () => {
		const { body: forgotBody } = await api
			.post(`${API}/auth/forgot-password`)
			.send({ email: CREDENTIALS.employee.email })
			.expect(200);

		const resetToken = forgotBody.data?.resetToken;
		expect(resetToken).toBeDefined();

		const { body } = await api
			.get(`${API}/auth/reset-password`)
			.query({ token: resetToken })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Reset code verified");
		expect(body.data.code).toMatch(/^\d{6}$/);
		expect(body.data.email).toBe(CREDENTIALS.employee.email);
	});

	it("should verify reset password with code", async () => {
		const { body: forgotBody } = await api
			.post(`${API}/auth/forgot-password`)
			.send({ email: CREDENTIALS.employee.email })
			.expect(200);

		const resetCode = forgotBody.data?.resetCode;
		expect(resetCode).toBeDefined();

		const { body } = await api
			.get(`${API}/auth/reset-password/${resetCode}`)
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Reset code verified");
		expect(body.data.code).toBe(resetCode);
	});

	it("should reset password with a valid code", async () => {
		const { body: forgotBody } = await api
			.post(`${API}/auth/forgot-password`)
			.send({ email: CREDENTIALS.employee.email })
			.expect(200);

		const resetCode = forgotBody.data?.resetCode;
		expect(resetCode).toBeDefined();

		const { body } = await api
			.patch(`${API}/auth/reset-password/${resetCode}`)
			.send({
				newPassword: DEMO_PASSWORD,
				confirmNewPassword: DEMO_PASSWORD,
			})
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Password reset successful");
	});

	it("should reject reset password when confirmation does not match", async () => {
		const { body: forgotBody } = await api
			.post(`${API}/auth/forgot-password`)
			.send({ email: CREDENTIALS.employee.email })
			.expect(200);

		const resetCode = forgotBody.data?.resetCode;

		const { body } = await api
			.patch(`${API}/auth/reset-password/${resetCode}`)
			.send({
				newPassword: DEMO_PASSWORD,
				confirmNewPassword: "DifferentPass@123",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("confirmNewPassword");
	});

	it("should reject reset password with invalid code format", async () => {
		const { body } = await api
			.patch(`${API}/auth/reset-password/abc123`)
			.send({
				newPassword: DEMO_PASSWORD,
				confirmNewPassword: DEMO_PASSWORD,
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("code must be a 6-digit number");
	});

	it("should change password when authenticated", async () => {
		const { token } = await login(CREDENTIALS.employee.email);
		const newPassword = "TempPass@456";

		const { body } = await api
			.patch(`${API}/auth/change-password`)
			.set(authHeader(token))
			.send({
				currentPassword: DEMO_PASSWORD,
				newPassword,
				confirmNewPassword: newPassword,
			})
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Password changed successfully");

		const { token: restoredToken } = await login(
			CREDENTIALS.employee.email,
			newPassword,
		);

		await api
			.patch(`${API}/auth/change-password`)
			.set(authHeader(restoredToken))
			.send({
				currentPassword: newPassword,
				newPassword: DEMO_PASSWORD,
				confirmNewPassword: DEMO_PASSWORD,
			})
			.expect(200);
	});

	it("should reject change password when confirmation does not match", async () => {
		const { token } = await login(CREDENTIALS.employee.email);

		const { body } = await api
			.patch(`${API}/auth/change-password`)
			.set(authHeader(token))
			.send({
				currentPassword: DEMO_PASSWORD,
				newPassword: "TempPass@456",
				confirmNewPassword: "DifferentPass@123",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("confirmNewPassword");
	});

	it("should reject change password with a short new password", async () => {
		const { token } = await login(CREDENTIALS.employee.email);

		const { body } = await api
			.patch(`${API}/auth/change-password`)
			.set(authHeader(token))
			.send({
				currentPassword: DEMO_PASSWORD,
				newPassword: "short",
				confirmNewPassword: "short",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("newPassword must be at least 8 characters");
	});

	it("should reject logout when not authenticated", async () => {
		const { body } = await api.post(`${API}/auth/logout`).expect(401);

		expect(body.status).toBe("UNAUTHORIZED");
		expect(body.message).toBe("Please login to continue");
	});

	it("should logout successfully", async () => {
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.post(`${API}/auth/logout`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Logout successful");
	});

	it("should record logout in audit logs", async () => {
		const { token } = await login(CREDENTIALS.hr.email);

		await api.post(`${API}/auth/logout`).set(authHeader(token)).expect(200);

		const { token: adminToken } = await login(CREDENTIALS.admin.email);
		const { body } = await api
			.get(`${API}/audit-logs?search=logged%20out`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(
			body.data.logs.some(
				(log: { action: string; description: string }) =>
					log.action === "logged_out" && log.description.includes("logged out"),
			),
		).toBe(true);
	});

	it("should reject a token after logout", async () => {
		const { token } = await login(CREDENTIALS.hr.email);

		await api
			.post(`${API}/auth/logout`)
			.set(authHeader(token))
			.expect(200);

		const { body } = await api
			.patch(`${API}/auth/change-password`)
			.set(authHeader(token))
			.send({
				currentPassword: DEMO_PASSWORD,
				newPassword: "TempPass@456",
				confirmNewPassword: "TempPass@456",
			})
			.expect(401);

		expect(body.status).toBe("UNAUTHORIZED");
		expect(body.message).toBe("Session expired, please login again");
	});

	it("should list all users as admin", async () => {
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.get(`${API}/auth/users`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Users retrieved");
		expect(body.data.users.length).toBeGreaterThan(0);
		expect(body.data.pagination).toBeDefined();
		expect(body.data.users[0].password).toBeUndefined();
	});

	it("should reject list users for non-admin", async () => {
		const { token } = await login(CREDENTIALS.hr.email);

		const { body } = await api
			.get(`${API}/auth/users`)
			.set(authHeader(token))
			.expect(403);

		expect(body.status).toBe("FORBIDDEN");
		expect(body.message).toBe("Access denied");
	});

	it("should list managers as admin", async () => {
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.get(`${API}/auth/managers`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Managers retrieved");
		expect(body.data.managers.length).toBeGreaterThan(0);
		expect(body.data.managers[0].role.name).toBe("Manager");
		expect(body.data.managers[0].password).toBeUndefined();
		expect(body.data.managers.some((m: { id: string }) => m.id === USERS.ALEX_MANAGER)).toBe(
			true,
		);
	});

	it("should list managers as hr", async () => {
		const { token } = await login(CREDENTIALS.hr.email);

		const { body } = await api
			.get(`${API}/auth/managers`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Managers retrieved");
		expect(body.data.managers.length).toBeGreaterThan(0);
	});

	it("should reject list managers for employee", async () => {
		const { token } = await login(CREDENTIALS.employee.email);

		const { body } = await api
			.get(`${API}/auth/managers`)
			.set(authHeader(token))
			.expect(403);

		expect(body.status).toBe("FORBIDDEN");
	});

	it("should get my profile", async () => {
		const { token } = await login(CREDENTIALS.employee.email);

		const { body } = await api
			.get(`${API}/auth/users/me`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee retrieved");
		expect(body.data.email).toBe(CREDENTIALS.employee.email);
	});

	it("should update my profile", async () => {
		const { token } = await login(CREDENTIALS.employee.email);

		const { body } = await api
			.patch(`${API}/auth/users/me`)
			.set(authHeader(token))
			.send({ phone: "+19998887777" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee updated");
		expect(body.data.phone).toBe("+19998887777");
	});

	it("should deactivate a user as admin", async () => {
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.patch(`${API}/auth/users/${USERS.PETER_EMPLOYEE}/deactivate`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("User deactivated");
		expect(body.data.status.name).toBe("Inactive");

		await api
			.post(`${API}/auth/login`)
			.send({ email: "peter.smith@cyberstream.com", password: DEMO_PASSWORD })
			.expect(403);
	});

	it("should activate a user as admin", async () => {
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.patch(`${API}/auth/users/${USERS.PETER_EMPLOYEE}/activate`)
			.set(authHeader(token))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("User activated");
		expect(body.data.status.name).toBe("Active");
	});

	it("should reject deactivate for non-admin", async () => {
		const { token } = await login(CREDENTIALS.hr.email);

		const { body } = await api
			.patch(`${API}/auth/users/${USERS.PETER_EMPLOYEE}/deactivate`)
			.set(authHeader(token))
			.expect(403);

		expect(body.status).toBe("FORBIDDEN");
	});

	it("should reject admin deactivating their own account", async () => {
		const { token } = await login(CREDENTIALS.admin.email);

		const { body } = await api
			.patch(`${API}/auth/users/${USERS.JOHN_ADMIN}/deactivate`)
			.set(authHeader(token))
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toBe("You cannot deactivate your own account");
	});
});
