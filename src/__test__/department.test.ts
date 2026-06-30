import {
	API,
	CREDENTIALS,
	USERS,
	api,
	authHeader,
	login,
	uniqueSuffix,
} from "./helpers";

jest.setTimeout(30000);

const DEPARTMENT_STATUSES = {
	ACTIVE: "6a1db2f2-08ce-4087-8a55-1656cc0cd920",
	INACTIVE: "adbf8e25-9bef-4330-b660-d58c52149349",
} as const;

describe("DEPARTMENT API TEST", () => {
	let adminToken = "";
	let hrToken = "";
	let createdDepartmentId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;

		const hr = await login(CREDENTIALS.hr.email);
		hrToken = hr.token;
	});

	it("should list departments", async () => {
		const { body } = await api
			.get(`${API}/departments`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Departments retrieved");
		expect(body.data.departments).toBeInstanceOf(Array);
		expect(body.data.departments.length).toBeGreaterThan(0);
	});

	it("should create a department as HR", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/departments`)
			.set(authHeader(hrToken))
			.send({
				name: `Test Department ${suffix}`,
				description: "Department created for API tests",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Department created");
		expect(body.data.name).toBe(`Test Department ${suffix}`);
		expect(body.data.status.name).toBe("Active");
		createdDepartmentId = body.data.id;
	});

	it("should get a department by id", async () => {
		const { body } = await api
			.get(`${API}/departments/${createdDepartmentId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Department retrieved");
		expect(body.data.id).toBe(createdDepartmentId);
	});

	it("should update a department", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}`)
			.set(authHeader(hrToken))
			.send({ description: "Updated department description" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Department updated");
		expect(body.data.description).toBe("Updated department description");
	});

	it("should assign a manager to a department", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}/assign-manager`)
			.set(authHeader(hrToken))
			.send({ managerId: USERS.ALEX_MANAGER })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Department manager assigned");
		expect(body.data.manager.id).toBe(USERS.ALEX_MANAGER);
	});

	it("should assign status to a department as HR", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}/assign-status`)
			.set(authHeader(hrToken))
			.send({ statusId: DEPARTMENT_STATUSES.ACTIVE })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Department status assigned");
		expect(body.data.status.id).toBe(DEPARTMENT_STATUSES.ACTIVE);
	});

	it("should reject inactive status assignment by HR", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}/assign-status`)
			.set(authHeader(hrToken))
			.send({ statusId: DEPARTMENT_STATUSES.INACTIVE })
			.expect(403);

		expect(body.status).toBe("FORBIDDEN");
		expect(body.message).toBe("Only admins can deactivate departments");
	});

	it("should allow admin to assign inactive status to a department", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}/assign-status`)
			.set(authHeader(adminToken))
			.send({ statusId: DEPARTMENT_STATUSES.INACTIVE })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Department status assigned");
		expect(body.data.status.name).toBe("Inactive");
	});

	it("should reject department deactivation by HR", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}/deactivate`)
			.set(authHeader(hrToken))
			.expect(403);

		expect(body.status).toBe("FORBIDDEN");
	});

	it("should deactivate a department as admin", async () => {
		const { body } = await api
			.patch(`${API}/departments/${createdDepartmentId}/deactivate`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Department deactivated");
		expect(body.data.status.name).toBe("Inactive");
	});

	it("should reject department creation without a name", async () => {
		const { body } = await api
			.post(`${API}/departments`)
			.set(authHeader(hrToken))
			.send({ description: "Missing name" })
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("name is required");
	});

	it("should reject department creation with statusId", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/departments`)
			.set(authHeader(hrToken))
			.send({
				name: `Invalid Department ${suffix}`,
				statusId: DEPARTMENT_STATUSES.ACTIVE,
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("statusId");
	});

	it("should reject invalid department id", async () => {
		const { body } = await api
			.get(`${API}/departments/not-a-uuid`)
			.set(authHeader(adminToken))
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("id must be a valid UUID");
	});
});
