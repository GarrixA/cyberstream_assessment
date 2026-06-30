import { Model } from "sequelize";

const employeeIncludes = [
	{ association: "role" },
	{ association: "department" },
	{ association: "position" },
	{ association: "status" },
	{ association: "employmentType" },
	{
		association: "manager",
		attributes: ["id", "firstName", "lastName", "email", "employeeCode"],
	},
	{ association: "accounts", include: [{ association: "status" }] },
];

const employeeDetailIncludes = [
	{ association: "role", include: [{ association: "permissions" }] },
	{ association: "department" },
	{ association: "position" },
	{ association: "status" },
	{ association: "employmentType" },
	{
		association: "manager",
		attributes: ["id", "firstName", "lastName", "email", "employeeCode"],
	},
	{ association: "accounts", include: [{ association: "status" }] },
];

export const sanitizeEmployee = (
	employee: Model | Record<string, unknown>,
	canViewSalary: boolean,
) => {
	const data =
		"get" in employee && typeof employee.get === "function"
			? (employee as Model).get({ plain: true })
			: { ...employee };
	if (!canViewSalary) {
		delete data.salary;
	}
	delete data.password;
	return data;
};

export { employeeIncludes, employeeDetailIncludes };
