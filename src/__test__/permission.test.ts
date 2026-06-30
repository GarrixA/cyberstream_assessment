import { API, CREDENTIALS, api, authHeader, login, uniqueSuffix } from "./helpers";

jest.setTimeout(30000);

describe("PERMISSION API TEST", () => {
	let adminToken = "";
	let createdPermissionId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
	});

	it("should list permissions", async () => {
		const { body } = await api
			.get(`${API}/permissions`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Permissions retrieved");
		expect(body.data.permissions).toBeInstanceOf(Array);
		expect(body.data.permissions.length).toBeGreaterThan(0);
	});

	it("should get a permission by id", async () => {
		const { body: listBody } = await api
			.get(`${API}/permissions`)
			.set(authHeader(adminToken))
			.expect(200);

		const permissionId = listBody.data.permissions[0].id;

		const { body } = await api
			.get(`${API}/permissions/${permissionId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Permission retrieved");
		expect(body.data.id).toBe(permissionId);
	});

	it("should create a permission", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/permissions`)
			.set(authHeader(adminToken))
			.send({
				code: `test.permission.${suffix}`,
				name: `Test Permission ${suffix}`,
				description: "Permission created for API tests",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Permission created");
		expect(body.data.code).toBe(`test.permission.${suffix}`);
		createdPermissionId = body.data.id;
	});

	it("should update a permission", async () => {
		const { body } = await api
			.patch(`${API}/permissions/${createdPermissionId}`)
			.set(authHeader(adminToken))
			.send({ description: "Updated permission description" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Permission updated");
		expect(body.data.description).toBe("Updated permission description");
	});

	it("should delete a permission", async () => {
		const { body } = await api
			.delete(`${API}/permissions/${createdPermissionId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Permission deleted");
	});
});
