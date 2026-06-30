import {
	API,
	CREDENTIALS,
	DEPARTMENTS,
	POSITIONS,
	STATUSES,
	api,
	authHeader,
	login,
	uniqueSuffix,
} from "./helpers";

jest.setTimeout(30000);

describe("POSITION API TEST", () => {
	let adminToken = "";
	let createdPositionId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
	});

	it("should list positions", async () => {
		const { body } = await api
			.get(`${API}/positions`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Positions retrieved");
		expect(body.data.positions).toBeInstanceOf(Array);
		expect(body.data.positions.length).toBeGreaterThan(0);
	});

	it("should create a position", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/positions`)
			.set(authHeader(adminToken))
			.send({
				title: `Test Position ${suffix}`,
				description: "Position created for API tests",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Position created");
		expect(body.data.title).toBe(`Test Position ${suffix}`);
		createdPositionId = body.data.id;
	});

	it("should get a position by id", async () => {
		const { body } = await api
			.get(`${API}/positions/${POSITIONS.SOFTWARE_ENGINEER}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Position retrieved");
		expect(body.data.id).toBe(POSITIONS.SOFTWARE_ENGINEER);
	});

	it("should update a position", async () => {
		const { body } = await api
			.patch(`${API}/positions/${createdPositionId}`)
			.set(authHeader(adminToken))
			.send({ description: "Updated position description" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Position updated");
		expect(body.data.description).toBe("Updated position description");
	});

	it("should assign a department to a position", async () => {
		const { body } = await api
			.patch(`${API}/positions/${createdPositionId}/assign-department`)
			.set(authHeader(adminToken))
			.send({ departmentId: DEPARTMENTS.ENGINEERING })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Position department assigned");
		expect(body.data.department.id).toBe(DEPARTMENTS.ENGINEERING);
	});

	it("should assign status to a position", async () => {
		const { body } = await api
			.patch(`${API}/positions/${createdPositionId}/assign-status`)
			.set(authHeader(adminToken))
			.send({ statusId: STATUSES.POSITION_ACTIVE })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Position status assigned");
		expect(body.data.status.id).toBe(STATUSES.POSITION_ACTIVE);
	});

	it("should allow admin to assign inactive status to a position", async () => {
		const { body } = await api
			.patch(`${API}/positions/${createdPositionId}/assign-status`)
			.set(authHeader(adminToken))
			.send({ statusId: STATUSES.POSITION_INACTIVE })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Position status assigned");
		expect(body.data.status.name).toBe("Inactive");
	});

	it("should deactivate a position", async () => {
		const { body } = await api
			.patch(`${API}/positions/${createdPositionId}/deactivate`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Position deactivated");
		expect(body.data.status.name).toBe("Inactive");
	});
});
