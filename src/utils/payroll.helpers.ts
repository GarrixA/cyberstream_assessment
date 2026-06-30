import { formatDateOnly } from "./dateRange";

export const PAYROLL_DEDUCTION_RATE = Number(
	process.env.PAYROLL_DEDUCTION_RATE ?? 0.15,
);

export const getCurrentPayPeriod = () => {
	const now = new Date();
	const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	return {
		periodStart: formatDateOnly(periodStart),
		periodEnd: formatDateOnly(periodEnd),
	};
};

export const calculatePayrollAmounts = (salary: number) => {
	const grossSalary = Number(Number(salary).toFixed(2));
	const deductions = Number((grossSalary * PAYROLL_DEDUCTION_RATE).toFixed(2));
	const netSalary = Number((grossSalary - deductions).toFixed(2));

	return { grossSalary, deductions, netSalary };
};

export const formatPayPeriodNote = (periodStart: string) => {
	const [year, month] = periodStart.split("-");
	const date = new Date(Number(year), Number(month) - 1, 1);
	const label = date.toLocaleString("en-US", { month: "long", year: "numeric" });
	return `${label} payroll`;
};
