import app from "../app";
import request from "supertest";

const Jest_request = request(app);

describe("SERVER API TEST", () => {
	it("should return welcome page on GET /", async () => {
		const { text } = await Jest_request.get("/").expect(200);
		expect(text).toContain("Welcome to CyberStream");
	});

	it("should return health status on GET /health", async () => {
		const { body } = await Jest_request.get("/health").expect(200);
		expect(body.status).toBe("ok");
		expect(body.message).toBe("CyberStream is running");
	});

	it("should return welcome JSON on GET /api/v1", async () => {
		const { body } = await Jest_request.get("/api/v1").expect(200);
		expect(body.message).toBe("Welcome to CyberStream Employee Management API");
	});
});
