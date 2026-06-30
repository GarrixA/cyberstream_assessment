import database_models from "../database/config/db.config";

const EMPLOYEE_CODE_PATTERN = /^EMP-(\d+)$/;

export const generateEmployeeCode = async (): Promise<string> => {
	const lastUser = await database_models.User.findOne({
		order: [["employeeCode", "DESC"]],
		attributes: ["employeeCode"],
	});

	const match = lastUser?.employeeCode.match(EMPLOYEE_CODE_PATTERN);
	const nextNumber = match ? Number.parseInt(match[1], 10) + 1 : 1;

	return `EMP-${String(nextNumber).padStart(3, "0")}`;
};
