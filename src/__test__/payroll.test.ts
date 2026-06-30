import {
	calculatePayrollAmounts,
	getCurrentPayPeriod,
} from "../utils/payroll.helpers";
import { API, CREDENTIALS, USERS, api, authHeader, login } from "./helpers";

jest.setTimeout(30000);

describe("PAYROLL API TEST", () => {
	let adminToken = "";
	let hrToken = "";
	let employeeToken = "";
	let seededPayrollId = "";
	let createdPayrollId = "";

	beforeAll(async () => {
		const admin = await login(CREDENTIALS.admin.email);
		adminToken = admin.token;

		const hr = await login(CREDENTIALS.hr.email);
		hrToken = hr.token;

		const employee = await login(CREDENTIALS.employee.email);
		employeeToken = employee.token;
	});

	it("should list payroll records as HR", async () => {
		const { body } = await api
			.get(`${API}/payroll`)
			.set(authHeader(hrToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Payroll records retrieved");
		expect(body.data.payroll).toBeInstanceOf(Array);
		expect(body.data.payroll.length).toBeGreaterThan(0);
		seededPayrollId = body.data.payroll[0].id;
	});

	it("should get a payroll record by id as admin", async () => {
		const { body } = await api
			.get(`${API}/payroll/${seededPayrollId}`)
			.set(authHeader(adminToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Payroll record retrieved");
		expect(body.data.id).toBe(seededPayrollId);
	});

	it("should create a payroll record from userId only as HR", async () => {
		const { periodStart, periodEnd } = getCurrentPayPeriod();
		const { grossSalary, deductions, netSalary } =
			calculatePayrollAmounts(82000);

		const { body } = await api
			.post(`${API}/payroll`)
			.set(authHeader(hrToken))
			.send({ userId: USERS.PETER_EMPLOYEE })
			.expect(201);

		expect(body.status).toBe("CREATED");
		expect(body.message).toBe("Payroll record created");
		expect(body.data.status.name).toBe("Pending");
		expect(body.data.periodStart).toBe(periodStart);
		expect(body.data.periodEnd).toBe(periodEnd);
		expect(Number(body.data.grossSalary)).toBe(grossSalary);
		expect(Number(body.data.deductions)).toBe(deductions);
		expect(Number(body.data.netSalary)).toBe(netSalary);
		createdPayrollId = body.data.id;
	});

	it("should update a payroll record as admin", async () => {
		const { body } = await api
			.patch(`${API}/payroll/${createdPayrollId}`)
			.set(authHeader(adminToken))
			.send({ notes: "Updated API test payroll" })
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Payroll record updated");
		expect(body.data.notes).toBe("Updated API test payroll");
	});

	it("should delete a pending payroll record as HR", async () => {
		const { body } = await api
			.delete(`${API}/payroll/${createdPayrollId}`)
			.set(authHeader(hrToken))
			.expect(200);

		expect(body.status).toBe("SUCCESS");
		expect(body.message).toBe("Payroll record deleted");
	});

	it("should reject payroll access for employees", async () => {
		const { body } = await api
			.get(`${API}/payroll`)
			.set(authHeader(employeeToken))
			.expect(403);

		expect(body.status).toBe("FORBIDDEN");
	});
});
