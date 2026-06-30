import { PaginationQuery } from "../types/model";
import { throwError } from "./errors";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const formatDateOnly = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const parseDateOnly = (value: string, field: string): Date => {
	if (!DATE_ONLY_PATTERN.test(value)) {
		throwError(
			"ATTENDANCE_INVALID_DATE",
			`${field} must be a valid date in YYYY-MM-DD format`,
		);
	}

	const [yearStr, monthStr, dayStr] = value.split("-");
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	const date = new Date(year, month - 1, day);

	if (formatDateOnly(date) !== value) {
		throwError(
			"ATTENDANCE_INVALID_DATE",
			`${field} must be a valid date in YYYY-MM-DD format`,
		);
	}

	return date;
};

const startOfNextDay = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

export type DateRange = {
	startDate: string;
	endDate: string;
	rangeStart: Date;
	rangeEndExclusive: Date;
};

export const parseAttendanceDateRange = (
	query: Pick<PaginationQuery, "date" | "startDate" | "endDate">,
): DateRange => {
	if (query.date) {
		const day = parseDateOnly(query.date, "date");
		const date = formatDateOnly(day);
		return {
			startDate: date,
			endDate: date,
			rangeStart: day,
			rangeEndExclusive: startOfNextDay(day),
		};
	}

	const today = formatDateOnly(new Date());
	const startStr = query.startDate ?? query.endDate ?? today;
	const endStr = query.endDate ?? query.startDate ?? today;

	const rangeStart = parseDateOnly(startStr, "startDate");
	const rangeEndDay = parseDateOnly(endStr, "endDate");

	if (rangeStart > rangeEndDay) {
		throwError(
			"ATTENDANCE_INVALID_DATE",
			"startDate must be on or before endDate",
		);
	}

	return {
		startDate: startStr,
		endDate: endStr,
		rangeStart,
		rangeEndExclusive: startOfNextDay(rangeEndDay),
	};
};
