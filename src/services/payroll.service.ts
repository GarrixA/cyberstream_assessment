import database_models from "../database/config/db.config";
import { PaginationQuery } from "../types/model";
import { parsePagination, buildPaginationMeta } from "../utils/pagination";
import { createAuditLog, formatActorName } from "../utils/audit";
import { assertOrThrow, throwError } from "../utils/errors";
import {
	calculatePayrollAmounts,
	formatPayPeriodNote,
	getCurrentPayPeriod,
} from "../utils/payroll.helpers";

const payrollIncludes = [
	{ association: "employee", attributes: ["id", "firstName", "lastName", "email"] },
	{ association: "status" },
];

const getPayrollStatus = async (name: string) =>
	database_models.Status.findOne({ where: { name, category: "payroll" } });

const calculateNetSalary = (grossSalary: number, deductions: number) =>
	Number((grossSalary - deductions).toFixed(2));

export const listPayroll = async (query: PaginationQuery) => {
	const { page, limit, offset } = parsePagination(query);
	const where: Record<string, unknown> = {};
	if (query.search) {
		where.userId = query.search;
	}

	const { rows, count } = await database_models.PayrollRecord.findAndCountAll({
		where,
		include: payrollIncludes,
		limit,
		offset,
		order: [["periodStart", "DESC"]],
	});

	return {
		payroll: rows,
		pagination: buildPaginationMeta(count, page, limit),
	};
};

export const getPayrollById = async (id: string) => {
	const record = await database_models.PayrollRecord.findByPk(id, {
		include: payrollIncludes,
	});
	assertOrThrow(record, "PAYROLL_NOT_FOUND");
	return record;
};

export const createPayroll = async (
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const userId = data.userId as string;
	assertOrThrow(userId, "EMPLOYEE_NOT_FOUND");

	const employee = await database_models.User.findByPk(userId);
	assertOrThrow(employee, "EMPLOYEE_NOT_FOUND");

	if (employee.salary == null || Number(employee.salary) <= 0) {
		throwError("PAYROLL_SALARY_NOT_SET");
	}

	const { periodStart, periodEnd } = getCurrentPayPeriod();
	const existing = await database_models.PayrollRecord.findOne({
		where: {
			userId,
			periodStart,
			periodEnd,
		},
	});
	if (existing) {
		throwError("PAYROLL_ALREADY_EXISTS");
	}

	const pendingStatus = await getPayrollStatus("Pending");
	const { grossSalary, deductions, netSalary } = calculatePayrollAmounts(
		Number(employee.salary),
	);

	const record = await database_models.PayrollRecord.create({
		userId,
		periodStart,
		periodEnd,
		grossSalary,
		deductions,
		netSalary,
		statusId: pendingStatus!.id,
		notes: (data.notes as string) ?? formatPayPeriodNote(periodStart),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "created",
		entityType: "payroll",
		entityId: record.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} created a payroll record for ${employee.firstName} ${employee.lastName}.`,
		metadata: { userId: employee.id, netSalary },
	});

	return getPayrollById(record.id);
};

export const updatePayroll = async (
	id: string,
	data: Record<string, unknown>,
	actor: { id: string },
) => {
	const record = await database_models.PayrollRecord.findByPk(id);
	assertOrThrow(record, "PAYROLL_NOT_FOUND");

	const grossSalary =
		data.grossSalary !== undefined ? Number(data.grossSalary) : Number(record.grossSalary);
	const deductions =
		data.deductions !== undefined ? Number(data.deductions) : Number(record.deductions);
	const netSalary =
		data.netSalary !== undefined
			? Number(data.netSalary)
			: data.grossSalary !== undefined || data.deductions !== undefined
				? calculateNetSalary(grossSalary, deductions)
				: Number(record.netSalary);

	await record.update({
		...(data.periodStart !== undefined && { periodStart: data.periodStart as string }),
		...(data.periodEnd !== undefined && { periodEnd: data.periodEnd as string }),
		...(data.grossSalary !== undefined && { grossSalary }),
		...(data.deductions !== undefined && { deductions }),
		...(data.netSalary !== undefined ||
			data.grossSalary !== undefined ||
			data.deductions !== undefined
			? { netSalary }
			: {}),
		...(data.statusId !== undefined && { statusId: data.statusId as string }),
		...(data.notes !== undefined && { notes: data.notes as string | null }),
	});

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "updated",
		entityType: "payroll",
		entityId: record.id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} updated a payroll record.`,
	});

	return getPayrollById(id);
};

export const deletePayroll = async (id: string, actor: { id: string }) => {
	const record = await database_models.PayrollRecord.findByPk(id, {
		include: [{ association: "status" }],
	});
	assertOrThrow(record, "PAYROLL_NOT_FOUND");

	const statusName = (record as { status?: { name?: string } }).status?.name;
	if (statusName !== "Pending") {
		throwError("PAYROLL_DELETE_NOT_PENDING");
	}

	await record.destroy();

	const actorUser = await database_models.User.findByPk(actor.id);
	await createAuditLog({
		actorId: actor.id,
		action: "deleted",
		entityType: "payroll",
		entityId: id,
		description: `${formatActorName(actorUser?.firstName, actorUser?.lastName)} deleted a payroll record.`,
	});
};
