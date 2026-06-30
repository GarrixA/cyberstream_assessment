import {
	API,
	CREDENTIALS,
	EMPLOYMENT_TYPES,
	api,
	authHeader,
	login,
	uniqueSuffix,
} from "./helpers";

jest.setTimeout(30000);

describe("EMPLOYMENT TYPE API TEST", () => {
	let adminToken = "";
	let createdEmploymentTypeId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
	});

	it("should list employment types", async () => {
		const { body } = await api
			.get(`${API}/employment-types`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employment types retrieved");
		expect(body.data.employmentTypes).toBeInstanceOf(Array);
		expect(body.data.employmentTypes.length).toBeGreaterThan(0);
	});

	it("should create an employment type", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/employment-types`)
			.set(authHeader(adminToken))
			.send({
				name: `Test Employment Type ${suffix}`,
				description: "Employment type created for API tests",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Employment type created");
		expect(body.data.name).toBe(`Test Employment Type ${suffix}`);
		createdEmploymentTypeId = body.data.id;
	});

	it("should get an employment type by id", async () => {
		const { body } = await api
			.get(`${API}/employment-types/${EMPLOYMENT_TYPES.FULL_TIME}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employment type retrieved");
		expect(body.data.id).toBe(EMPLOYMENT_TYPES.FULL_TIME);
		expect(body.data.name).toBe("Full-time");
	});

	it("should update an employment type", async () => {
		const { body } = await api
			.patch(`${API}/employment-types/${createdEmploymentTypeId}`)
			.set(authHeader(adminToken))
			.send({ description: "Updated employment type description" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employment type updated");
		expect(body.data.description).toBe("Updated employment type description");
	});

	it("should reject deleting an employment type in use", async () => {
		const { body } = await api
			.delete(`${API}/employment-types/${EMPLOYMENT_TYPES.FULL_TIME}`)
			.set(authHeader(adminToken))
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toBe(
			"Employment type is assigned to employees and cannot be deleted",
		);
	});

	it("should delete an employment type", async () => {
		const { body } = await api
			.delete(`${API}/employment-types/${createdEmploymentTypeId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employment type deleted");
	});
});
