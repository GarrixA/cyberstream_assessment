import { Op } from "sequelize";
import database_models from "../database/config/db.config";
import { sendAttendanceOvertimeEmail } from "../utils/email.service";
import {
	ATTENDANCE_CHECK_INTERVAL_MS,
	formatAttendanceDuration,
	getAttendanceMaxDurationMs,
} from "../utils/attendance.config";

export const checkOverdueAttendance = async () => {
	const maxDurationMs = getAttendanceMaxDurationMs();
	if (maxDurationMs <= 0) {
		return;
	}

	const cutoff = new Date(Date.now() - maxDurationMs);

	const overdueSessions = await database_models.Attendance.findAll({
		where: {
			logoutAt: { [Op.is]: null },
			loginAt: { [Op.lte]: cutoff },
			overtimeNotifiedAt: { [Op.is]: null },
		},
		include: [
			{
				association: "user",
				attributes: ["id", "email", "firstName"],
			},
		],
	});

	for (const session of overdueSessions) {
		const user = session.get("user") as {
			email: string;
			firstName: string;
		} | null;

		if (!user?.email) {
			continue;
		}

		try {
			await sendAttendanceOvertimeEmail({
				email: user.email,
				firstName: user.firstName,
			});
			await session.update({ overtimeNotifiedAt: new Date() });
			console.log(
				`[attendance] Overtime reminder sent to ${user.email} (session ${session.id})`,
			);
		} catch (error) {
			console.error(
				`[attendance] Failed to send overtime reminder to ${user.email}:`,
				(error as Error).message,
			);
		}
	}
};

let monitorTimer: NodeJS.Timeout | null = null;

export const startAttendanceMonitor = () => {
	if (monitorTimer) {
		return;
	}

	const maxDurationMs = getAttendanceMaxDurationMs();
	if (maxDurationMs <= 0) {
		console.log("[attendance] Overtime monitor disabled (max duration is 0)");
		return;
	}

	console.log(
		`[attendance] Overtime monitor started (max ${formatAttendanceDuration()}, check every ${ATTENDANCE_CHECK_INTERVAL_MS}ms)`,
	);

	void checkOverdueAttendance();
	monitorTimer = setInterval(() => {
		void checkOverdueAttendance();
	}, ATTENDANCE_CHECK_INTERVAL_MS);
};

export const stopAttendanceMonitor = () => {
	if (monitorTimer) {
		clearInterval(monitorTimer);
		monitorTimer = null;
	}
};
