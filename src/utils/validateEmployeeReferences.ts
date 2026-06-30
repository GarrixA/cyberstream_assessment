import database_models from "../database/config/db.config";
import { throwError } from "../utils/errors";

type EmployeeReferenceInput = {
	roleId?: unknown;
	departmentId?: unknown;
	positionId?: unknown;
	managerId?: unknown;
	employmentTypeId?: unknown;
	statusId?: unknown;
};

const assertExists = async (
	value: unknown,
	field: string,
	findByPk: (id: string) => Promise<unknown>,
) => {
	if (value === undefined || value === null || value === "") {
		return;
	}

	if (typeof value !== "string") {
		throwError("EMPLOYEE_INVALID_REFERENCE", `${field} must be a valid UUID`);
	}

	const record = await findByPk(value as string);
	if (!record) {
		throwError("EMPLOYEE_INVALID_REFERENCE", `${field} not found`);
	}
};

export const validateEmployeeReferences = async (
	data: EmployeeReferenceInput,
	options: { requireRole?: boolean } = {},
) => {
	if (options.requireRole && !data.roleId) {
		throwError("EMPLOYEE_INVALID_REFERENCE", "roleId is required");
	}

	await assertExists(data.roleId, "roleId", (id) =>
		database_models.Role.findByPk(id),
	);
	await assertExists(data.departmentId, "departmentId", (id) =>
		database_models.Department.findByPk(id),
	);
	await assertExists(data.positionId, "positionId", (id) =>
		database_models.Position.findByPk(id),
	);
	await assertExists(data.managerId, "managerId", (id) =>
		database_models.User.findByPk(id),
	);
	await assertExists(data.employmentTypeId, "employmentTypeId", (id) =>
		database_models.EmploymentType.findByPk(id),
	);
	await assertExists(data.statusId, "statusId", (id) =>
		database_models.Status.findByPk(id),
	);
};
