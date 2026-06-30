import { API, CREDENTIALS, api, authHeader, login } from "./helpers";

jest.setTimeout(30000);

describe("LEAVE API TEST", () => {
	let adminToken = "";
	let employeeToken = "";
	let createdLeaveId = "";
	let rejectLeaveId = "";
	let cancelLeaveId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
		const employee = await login(CREDENTIALS.employee.email);
		employeeToken = employee.token;
	});

	it("should list leaves", async () => {
		const { body } = await api
			.get(`${API}/leaves`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Leave records retrieved");
		expect(body.data.leaves).toBeInstanceOf(Array);
	});

	it("should create a leave request", async () => {
		const { body } = await api
			.post(`${API}/leaves`)
			.set(authHeader(employeeToken))
			.send({
				leave_name: "Summer vacation",
				start_date: "2026-08-01",
				end_date: "2026-08-05",
				reason: "API test leave",
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Leave request created");
		expect(body.data.leaveName).toBe("Summer vacation");
		expect(body.data.startDate).toBe("2026-08-01");
		expect(body.data.endDate).toBe("2026-08-05");
		expect(body.data.duration).toBe(5);
		expect(body.data.status.name).toBe("Pending");
		createdLeaveId = body.data.id;
	});

	it("should reject leave when end_date is before start_date", async () => {
		const { body } = await api
			.post(`${API}/leaves`)
			.set(authHeader(employeeToken))
			.send({
				leave_name: "Invalid leave",
				start_date: "2026-12-05",
				end_date: "2026-12-01",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("end_date must be on or after start_date");
	});

	it("should reject leave creation without leave_name", async () => {
		const { body } = await api
			.post(`${API}/leaves`)
			.set(authHeader(employeeToken))
			.send({
				start_date: "2026-11-01",
				end_date: "2026-11-02",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("leave_name is required");
	});

	it("should reject leave creation with invalid date format", async () => {
		const { body } = await api
			.post(`${API}/leaves`)
			.set(authHeader(employeeToken))
			.send({
				leave_name: "Invalid date leave",
				start_date: "01-08-2026",
				end_date: "2026-08-05",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("YYYY-MM-DD");
	});

	it("should reject invalid leave id", async () => {
		const { body } = await api
			.get(`${API}/leaves/not-a-uuid`)
			.set(authHeader(adminToken))
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
		expect(body.message).toContain("id must be a valid UUID");
	});

	it("should get a leave by id", async () => {
		const { body } = await api
			.get(`${API}/leaves/${createdLeaveId}`)
			.set(authHeader(employeeToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Leave request retrieved");
		expect(body.data.id).toBe(createdLeaveId);
	});

	it("should update a leave request", async () => {
		const { body } = await api
			.patch(`${API}/leaves/${createdLeaveId}`)
			.set(authHeader(employeeToken))
			.send({
				leave_name: "Extended vacation",
				start_date: "2026-08-01",
				end_date: "2026-08-07",
				reason: "Updated API test leave reason",
			})
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Leave request updated");
		expect(body.data.leaveName).toBe("Extended vacation");
		expect(body.data.reason).toBe("Updated API test leave reason");
		expect(body.data.endDate).toBe("2026-08-07");
		expect(body.data.duration).toBe(7);
	});

	it("should approve a leave request", async () => {
		const { body } = await api
			.patch(`${API}/leaves/${createdLeaveId}/approve`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Leave request approved");
		expect(body.data.status.name).toBe("Approved");
	});

	it("should reject a leave request", async () => {
		const { body: createBody } = await api
			.post(`${API}/leaves`)
			.set(authHeader(employeeToken))
			.send({
				leave_name: "Sick leave",
				start_date: "2026-09-01",
				end_date: "2026-09-02",
				reason: "Leave to reject",
			})
			.expect(201);

		rejectLeaveId = createBody.data.id;

		const { body } = await api
			.patch(`${API}/leaves/${rejectLeaveId}/reject`)
			.set(authHeader(adminToken))
			.send({ reason: "Rejected in API test" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Leave request rejected");
		expect(body.data.status.name).toBe("Rejected");
	});

	it("should cancel a leave request", async () => {
		const { body: createBody } = await api
			.post(`${API}/leaves`)
			.set(authHeader(employeeToken))
			.send({
				leave_name: "Personal leave",
				start_date: "2026-10-01",
				end_date: "2026-10-31",
				reason: "Leave to cancel",
			})
			.expect(201);

		cancelLeaveId = createBody.data.id;
		expect(createBody.data.duration).toBe(31);

		const { body } = await api
			.patch(`${API}/leaves/${cancelLeaveId}/cancel`)
			.set(authHeader(employeeToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Leave request cancelled");
		expect(body.data.status.name).toBe("Cancelled");
	});
});
