import dotenv from "dotenv";

dotenv.config();

jest.mock("./src/utils/sendEmail", () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue({
		messageId: "test-message-id",
		response: "250 OK",
	}),
	sendMail: jest.fn().mockResolvedValue({
		messageId: "test-message-id",
		response: "250 OK",
	}),
}));
