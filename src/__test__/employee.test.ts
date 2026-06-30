import {
	API,
	CREDENTIALS,
	DEPARTMENTS,
	EMPLOYMENT_TYPES,
	POSITIONS,
	PERMISSIONS,
	ROLES,
	USERS,
	api,
	authHeader,
	login,
	uniqueSuffix,
} from "./helpers";
import { formatDateOnly } from "../utils/dateRange";

jest.setTimeout(30000);

describe("EMPLOYEE API TEST", () => {
	let adminToken = "";
	let employeeToken = "";
	let createdEmployeeId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;
		const employee = await login(CREDENTIALS.employee.email);
		employeeToken = employee.token;
	});

	it("should list employees", async () => {
		const { body } = await api
			.get(`${API}/employees`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employees retrieved");
		expect(body.data.employees).toBeInstanceOf(Array);
		expect(body.data.employees.length).toBeGreaterThan(0);
	});

	it("should create an employee", async () => {
		const suffix = uniqueSuffix();
		const { body } = await api
			.post(`${API}/employees`)
			.set(authHeader(adminToken))
			.send({
				firstName: "Test",
				lastName: `Employee${suffix}`,
				email: `test.employee.${suffix}@cyberstream.com`,
				salary: 70000,
			})
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Employee created");
		expect(body.data.id).toBeDefined();
		expect(body.data.role).toBeNull();
		expect(body.data.department).toBeNull();
		expect(body.data.position).toBeNull();
		createdEmployeeId = body.data.id;
	});

	it("should assign role to employee", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/assign-role`)
			.set(authHeader(adminToken))
			.send({ roleId: ROLES.EMPLOYEE })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee role assigned");
		expect(body.data.role.id).toBe(ROLES.EMPLOYEE);
	});

	it("should assign department to employee", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/assign-department`)
			.set(authHeader(adminToken))
			.send({ departmentId: DEPARTMENTS.ENGINEERING })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee department assigned");
		expect(body.data.department.id).toBe(DEPARTMENTS.ENGINEERING);
	});

	it("should assign position to employee", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/assign-position`)
			.set(authHeader(adminToken))
			.send({ positionId: POSITIONS.SOFTWARE_ENGINEER })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee position assigned");
		expect(body.data.position.id).toBe(POSITIONS.SOFTWARE_ENGINEER);
	});

	it("should assign employment type to employee", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/assign-employment-type`)
			.set(authHeader(adminToken))
			.send({ employmentTypeId: EMPLOYMENT_TYPES.FULL_TIME })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee employment type assigned");
		expect(body.data.employmentType.id).toBe(EMPLOYMENT_TYPES.FULL_TIME);
	});

	it("should assign manager to employee", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/assign-manager`)
			.set(authHeader(adminToken))
			.send({ managerId: USERS.ALEX_MANAGER })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee manager assigned");
		expect(body.data.manager.id).toBe(USERS.ALEX_MANAGER);
	});

	it("should reject employee creation with invalid payload", async () => {
		const { body } = await api
			.post(`${API}/employees`)
			.set(authHeader(adminToken))
			.send({
				firstName: "Test",
			})
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
	});

	it("should get an employee by id", async () => {
		const { body } = await api
			.get(`${API}/employees/${USERS.JANE_EMPLOYEE}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee retrieved");
		expect(body.data.id).toBe(USERS.JANE_EMPLOYEE);
	});

	it("should update an employee by id", async () => {
		const { body } = await api
			.patch(`${API}/employees/${USERS.JANE_EMPLOYEE}`)
			.set(authHeader(adminToken))
			.send({ address: "Updated test address" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee updated");
		expect(body.data.address).toBe("Updated test address");
	});

	it("should list audit logs", async () => {
		const { body } = await api
			.get(`${API}/audit-logs`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Audit logs retrieved");
		expect(body.data.logs).toBeInstanceOf(Array);
	});

	it("should list attendance records for today by default", async () => {
		const today = formatDateOnly(new Date());
		const { body } = await api
			.get(`${API}/attendance`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Attendance retrieved");
		expect(body.data.attendance).toBeInstanceOf(Array);
		expect(body.data.dateRange).toEqual({ startDate: today, endDate: today });
		expect(body.data.attendance.length).toBeGreaterThan(0);
	});

	it("should list attendance records for a specific date", async () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const date = formatDateOnly(yesterday);

		const { body } = await api
			.get(`${API}/attendance`)
			.query({ date })
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.data.dateRange).toEqual({ startDate: date, endDate: date });
		expect(body.data.attendance.length).toBeGreaterThan(0);
	});

	it("should list attendance records for a date range", async () => {
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - 1);
		const startDate = formatDateOnly(start);
		const endDate = formatDateOnly(end);

		const { body } = await api
			.get(`${API}/attendance`)
			.query({ startDate, endDate })
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.data.dateRange).toEqual({ startDate, endDate });
		expect(body.data.attendance.length).toBeGreaterThan(0);
	});

	it("should reject invalid attendance date filters", async () => {
		const { body } = await api
			.get(`${API}/attendance`)
			.query({ date: "not-a-date" })
			.set(authHeader(adminToken))
			.expect(400);

		expect(body.status).toBe("BAD_REQUEST");
	});

	it("should reject role assignment with invalid roleId", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/assign-role`)
			.set(authHeader(adminToken))
			.send({ roleId: PERMISSIONS.EMPLOYEE_READ_ALL })
			.expect(404);

		expect(body.status).toBe("NOT_FOUND");
		expect(body.message).toBe("Role not found");
	});

	it("should deactivate an employee", async () => {
		const { body } = await api
			.patch(`${API}/employees/${createdEmployeeId}/deactivate`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Employee deactivated");
		expect(body.data.status.name).toBe("Inactive");
	});
});
