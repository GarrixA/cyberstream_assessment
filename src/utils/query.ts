import { Op } from "sequelize";
import { PaginationQuery } from "../types/model";

export const buildEmployeeSearchWhere = (query: PaginationQuery) => {
	const where: Record<string, unknown> = {};

	if (query.departmentId) where.departmentId = query.departmentId;
	if (query.roleId) where.roleId = query.roleId;
	if (query.statusId) where.statusId = query.statusId;
	if (query.positionId) where.positionId = query.positionId;
	if (query.employmentTypeId) where.employmentTypeId = query.employmentTypeId;
	if (query.managerId) where.managerId = query.managerId;

	if (query.search) {
		const term = `%${query.search}%`;
		Object.assign(where, {
			[Op.or]: [
				{ firstName: { [Op.iLike]: term } },
				{ lastName: { [Op.iLike]: term } },
				{ email: { [Op.iLike]: term } },
				{ employeeCode: { [Op.iLike]: term } },
				{ phone: { [Op.iLike]: term } },
			],
		});
	}

	return where;
};

export const getEmployeeSortField = (sortBy?: string) => {
	const allowed = [
		"firstName",
		"lastName",
		"email",
		"employeeCode",
		"dateJoined",
		"createdAt",
	];
	return allowed.includes(sortBy || "") ? sortBy! : "createdAt";
};
