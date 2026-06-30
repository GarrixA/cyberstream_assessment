import { API, CREDENTIALS, api, authHeader, login, uniqueSuffix } from "./helpers";

jest.setTimeout(30000);

describe("STATUS API TEST", () => {
	let adminToken = "";
	let createdStatusId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
	});

	it("should list statuses", async () => {
		const { body } = await api
			.get(`${API}/statuses`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Statuses retrieved");
		expect(body.data.statuses).toBeInstanceOf(Array);
		expect(body.data.statuses.length).toBeGreaterThan(0);
	});

	it("should get a status by id", async () => {
		const { body: listBody } = await api
			.get(`${API}/statuses`)
			.set(authHeader(adminToken))
			.expect(200);

		const statusId = listBody.data.statuses[0].id;

		const { body } = await api
			.get(`${API}/statuses/${statusId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Status retrieved");
		expect(body.data.id).toBe(statusId);
	});

	it("should create a status", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/statuses`)
			.set(authHeader(adminToken))
			.send({
				name: `Test Status ${suffix}`,
				category: "payroll",
				description: "Status created for API tests",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Status created");
		expect(body.data.name).toBe(`Test Status ${suffix}`);
		createdStatusId = body.data.id;
	});

	it("should update a status", async () => {
		const { body } = await api
			.patch(`${API}/statuses/${createdStatusId}`)
			.set(authHeader(adminToken))
			.send({ description: "Updated status description" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Status updated");
		expect(body.data.description).toBe("Updated status description");
	});

	it("should delete a status", async () => {
		const { body } = await api
			.delete(`${API}/statuses/${createdStatusId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Status deleted");
	});
});
