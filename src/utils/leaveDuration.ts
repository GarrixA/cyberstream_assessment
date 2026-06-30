import { throwError } from "./errors";

export type ParsedLeaveRequest = {
	leaveName: string;
	startDate: string;
	endDate: string;
	reason?: string | null;
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const readField = (data: Record<string, unknown>, ...keys: string[]): unknown => {
	for (const key of keys) {
		if (data[key] !== undefined && data[key] !== null) {
			return data[key];
		}
	}
	return undefined;
};

const parseDateOnly = (value: unknown, field: string): string => {
	if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) {
		throwError(
			"LEAVE_INVALID_DURATION",
			`${field} must be a valid date in YYYY-MM-DD format`,
		);
	}

	const dateString = value as string;
	const [yearStr, monthStr, dayStr] = dateString.split("-");
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	const date = new Date(year, month - 1, day);

	const normalized = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	if (normalized !== dateString) {
		throwError(
			"LEAVE_INVALID_DURATION",
			`${field} must be a valid date in YYYY-MM-DD format`,
		);
	}

	return dateString;
};

export const computeDurationFromDates = (startDate: string, endDate: string): number => {
	const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
	const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
	const start = new Date(startYear, startMonth - 1, startDay);
	const end = new Date(endYear, endMonth - 1, endDay);
	const duration =
		Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

	if (duration < 1) {
		throwError(
			"LEAVE_INVALID_DURATION",
			"end_date must be on or after start_date",
		);
	}

	return duration;
};

const requireNonEmptyString = (value: unknown, field: string): string => {
	if (typeof value !== "string" || value.trim().length === 0) {
		throwError("LEAVE_INVALID_DURATION", `${field} is required`);
	}
	return (value as string).trim();
};

export const parseLeaveRequest = (
	data: Record<string, unknown>,
	existing?: Partial<ParsedLeaveRequest>,
): ParsedLeaveRequest => {
	const leaveName = readField(data, "leave_name", "leaveName") ?? existing?.leaveName;
	const startDateValue =
		readField(data, "start_date", "startDate") ?? existing?.startDate;
	const endDateValue = readField(data, "end_date", "endDate") ?? existing?.endDate;
	const reason =
		readField(data, "reason") !== undefined
			? readField(data, "reason")
			: existing?.reason;

	const validLeaveName = requireNonEmptyString(leaveName, "leave_name");

	if (startDateValue === undefined) {
		throwError("LEAVE_INVALID_DURATION", "start_date is required");
	}

	if (endDateValue === undefined) {
		throwError("LEAVE_INVALID_DURATION", "end_date is required");
	}

	const startDate = parseDateOnly(startDateValue, "start_date");
	const endDate = parseDateOnly(endDateValue, "end_date");
	computeDurationFromDates(startDate, endDate);

	return {
		leaveName: validLeaveName,
		startDate,
		endDate,
		...(reason !== undefined && { reason: reason as string | null }),
	};
};
