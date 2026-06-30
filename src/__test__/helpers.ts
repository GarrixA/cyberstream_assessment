import app from "../app";
import request from "supertest";

export const API = "/api/v1";
export const DEMO_PASSWORD = "Password@123";

export const USERS = {
	JOHN_ADMIN: "928d59d2-045d-4063-852f-bd7bfc617ca0",
	MARY_HR: "fc195b84-19d8-4fea-a9f8-9ab2e6842085",
	ALEX_MANAGER: "7842f44d-615e-4f43-af4f-93f4c7ed88f4",
	JANE_EMPLOYEE: "f773d6fb-90b0-43f6-bc6a-88bb3241c7ab",
	PETER_EMPLOYEE: "922c2fc9-1d8d-4ed0-98c5-26da6da1a968",
} as const;

export const ROLES = {
	ADMIN: "5a73d45c-727e-46df-98f5-649db1ec0f09",
	HR: "8b05c188-d615-414e-94ee-ad2032e686fc",
	MANAGER: "298a9cb0-c5d4-4d2e-b99f-8398ecfe5b22",
	EMPLOYEE: "d6850d9c-06cd-4561-b1f1-cf34196bb9af",
} as const;

export const DEPARTMENTS = {
	ENGINEERING: "78d7400c-438f-40eb-af8b-b2a56e2fbe43",
	HR: "be35a138-5f4c-40cf-a2cc-3d9bf1813c7a",
} as const;

export const POSITIONS = {
	SOFTWARE_ENGINEER: "2ab31b22-a38f-4cdf-b42e-d0cf45965df1",
} as const;

export const EMPLOYMENT_TYPES = {
	FULL_TIME: "efa88efd-4ad9-4a37-bcf9-c4bfc0c69b20",
} as const;

export const PERMISSIONS = {
	EMPLOYEE_READ_ALL: "f1484a4f-8b6c-437e-9ad2-cfca23f070a5",
} as const;

export const STATUSES = {
	ROLE_ACTIVE: "9247b927-7afd-4c11-b1ab-34697309606e",
	POSITION_ACTIVE: "8572f12c-9699-4c70-abdc-e813410a0989",
	POSITION_INACTIVE: "c0f9f9b6-2a3c-4d4a-ad99-558fde73e0c7",
} as const;

export const CREDENTIALS = {
	admin: { email: "john.admin@cyberstream.com", password: DEMO_PASSWORD },
	hr: { email: "mary.hr@cyberstream.com", password: DEMO_PASSWORD },
	employee: { email: "jane.doe@cyberstream.com", password: DEMO_PASSWORD },
} as const;

export const api = request(app);

export const uniqueSuffix = () => Date.now().toString(36);

export const authHeader = (token: string) => ({
	Authorization: `Bearer ${token}`,
});

export const login = async (
	email: string,
	password: string = DEMO_PASSWORD,
) => {
	const { body } = await api
		.post(`${API}/auth/login`)
		.send({ email, password })
		.expect(200);

	return {
		token: body.data.token as string,
		attendanceId: body.data.attendanceId as string,
		user: body.data.user,
	};
};
