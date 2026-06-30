export const ATTENDANCE_MAX_HOURS = Number(process.env.ATTENDANCE_MAX_HOURS ?? 0);
export const ATTENDANCE_MAX_MINUTES = Number(
	process.env.ATTENDANCE_MAX_MINUTES ?? 0,
);
export const ATTENDANCE_MAX_SECONDS = Number(
	process.env.ATTENDANCE_MAX_SECONDS ?? 30,
);
export const ATTENDANCE_CHECK_INTERVAL_MS = Number(
	process.env.ATTENDANCE_CHECK_INTERVAL_MS ?? 30000,
);

export const getAttendanceMaxDurationMs = () => {
	const hours = Number(process.env.ATTENDANCE_MAX_HOURS ?? 0);
	const minutes = Number(process.env.ATTENDANCE_MAX_MINUTES ?? 0);
	const seconds = Number(process.env.ATTENDANCE_MAX_SECONDS ?? 30);

	return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};

export const formatAttendanceDuration = () => {
	const hours = Number(process.env.ATTENDANCE_MAX_HOURS ?? 0);
	const minutes = Number(process.env.ATTENDANCE_MAX_MINUTES ?? 0);
	const seconds = Number(process.env.ATTENDANCE_MAX_SECONDS ?? 30);
	const parts: string[] = [];
	if (hours > 0) {
		parts.push(`${hours}h`);
	}
	if (minutes > 0) {
		parts.push(`${minutes}m`);
	}
	if (seconds > 0 || parts.length === 0) {
		parts.push(`${seconds}s`);
	}
	return parts.join(" ");
};
