import database_models from "../database/config/db.config";
import { checkOverdueAttendance } from "../services/attendance.monitor.service";
import sendMail from "../utils/sendEmail";

describe("ATTENDANCE MONITOR", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.ATTENDANCE_MAX_HOURS = "0";
		process.env.ATTENDANCE_MAX_MINUTES = "0";
		process.env.ATTENDANCE_MAX_SECONDS = "1";
	});

	it("should send overtime email for sessions exceeding the allowed duration", async () => {
		const session = await database_models.Attendance.findOne({
			where: { logoutAt: null },
			order: [["loginAt", "DESC"]],
		});

		expect(session).toBeTruthy();
		await session!.update({
			loginAt: new Date(Date.now() - 2 * 60 * 1000),
			overtimeNotifiedAt: null,
		});

		await checkOverdueAttendance();

		expect(sendMail).toHaveBeenCalled();
		await session!.reload();
		expect(session!.overtimeNotifiedAt).not.toBeNull();
	});
});
