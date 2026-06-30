import {
	API,
	CREDENTIALS,
	STATUSES,
	api,
	authHeader,
	login,
	uniqueSuffix,
} from "./helpers";

jest.setTimeout(30000);

describe("ROLE API TEST", () => {
	let adminToken = "";
	let createdRoleId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
	});

	it("should list roles", async () => {
		const { body } = await api
			.get(`${API}/roles`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Roles retrieved");
		expect(body.data.roles).toBeInstanceOf(Array);
		expect(body.data.roles.length).toBeGreaterThan(0);
	});

	it("should create a role", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/roles`)
			.set(authHeader(adminToken))
			.send({
				name: `Test Role ${suffix}`,
				description: "Role created for API tests",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Role created");
		expect(body.data.name).toBe(`Test Role ${suffix}`);
		createdRoleId = body.data.id;
	});

	it("should get a role by id", async () => {
		const { body } = await api
			.get(`${API}/roles/${createdRoleId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Role retrieved");
		expect(body.data.id).toBe(createdRoleId);
	});

	it("should update a role", async () => {
		const { body } = await api
			.patch(`${API}/roles/${createdRoleId}`)
			.set(authHeader(adminToken))
			.send({ description: "Updated role description" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Role updated");
		expect(body.data.description).toBe("Updated role description");
	});

	it("should assign permissions to a role", async () => {
		const suffix = uniqueSuffix();
		const { body: permissionBody } = await api
			.post(`${API}/permissions`)
			.set(authHeader(adminToken))
			.send({
				code: `test.role.permission.${suffix}`,
				name: `Role Permission ${suffix}`,
			})
			.expect(201);

		const { body } = await api
			.patch(`${API}/roles/${createdRoleId}/assign-permissions`)
			.set(authHeader(adminToken))
			.send({ permissionIds: [permissionBody.data.id] })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Role permissions assigned");
		expect(body.data.permissions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: permissionBody.data.id }),
			]),
		);
	});

	it("should assign status to a role", async () => {
		const { body } = await api
			.patch(`${API}/roles/${createdRoleId}/assign-status`)
			.set(authHeader(adminToken))
			.send({ statusId: STATUSES.ROLE_ACTIVE })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Role status assigned");
		expect(body.data.status.id).toBe(STATUSES.ROLE_ACTIVE);
	});

	it("should delete a role", async () => {
		const { body } = await api
			.delete(`${API}/roles/${createdRoleId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Role deleted");
	});
});
