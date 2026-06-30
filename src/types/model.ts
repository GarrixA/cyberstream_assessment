import { Optional } from "sequelize";

export interface StatusAttributes {
	id: string;
	name: string;
	category:
		| "user"
		| "role"
		| "account"
		| "position"
		| "token"
		| "department"
		| "leave"
		| "payroll";
	description?: string | null;
}

export type StatusCreationAttributes = Optional<
	StatusAttributes,
	"id" | "description"
>;

export interface PermissionAttributes {
	id: string;
	code: string;
	name: string;
	description?: string | null;
}

export type PermissionCreationAttributes = Optional<
	PermissionAttributes,
	"id" | "description"
>;

export interface RoleAttributes {
	id: string;
	name: string;
	description?: string | null;
	statusId: string;
}

export type RoleCreationAttributes = Optional<RoleAttributes, "id" | "description">;

export interface DepartmentAttributes {
	id: string;
	name: string;
	description?: string | null;
	statusId: string;
	managerId?: string | null;
}

export type DepartmentCreationAttributes = Optional<DepartmentAttributes, "id" | "description" | "managerId">;

export interface PositionAttributes {
	id: string;
	title: string;
	description?: string | null;
	departmentId?: string | null;
	statusId: string;
}

export type PositionCreationAttributes = Optional<
	PositionAttributes,
	"id" | "description" | "departmentId"
>;

export interface EmploymentTypeAttributes {
	id: string;
	name: string;
	description?: string | null;
}

export type EmploymentTypeCreationAttributes = Optional<
	EmploymentTypeAttributes,
	"id" | "description"
>;

export interface UserAttributes {
	id: string;
	employeeCode: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string | null;
	password: string;
	positionId?: string | null;
	departmentId?: string | null;
	roleId?: string | null;
	managerId?: string | null;
	employmentTypeId?: string | null;
	salary?: number | null;
	statusId: string;
	profilePicture?: string | null;
	address?: string | null;
	emergencyContactName?: string | null;
	emergencyContactPhone?: string | null;
	emergencyContactRelation?: string | null;
	dateJoined: string;
	lastPasswordChanged?: Date | null;
}

export type UserCreationAttributes = Optional<
	UserAttributes,
	| "id"
	| "phone"
	| "positionId"
	| "departmentId"
	| "roleId"
	| "managerId"
	| "employmentTypeId"
	| "salary"
	| "profilePicture"
	| "address"
	| "emergencyContactName"
	| "emergencyContactPhone"
	| "emergencyContactRelation"
	| "lastPasswordChanged"
>;

export interface TokenAttributes {
	id: string;
	userId: string;
	token: string;
	type: "access" | "refresh" | "reset_password";
	statusId: string;
	expiresAt?: Date | null;
	invalidatedAt?: Date | null;
}

export type TokenCreationAttributes = Optional<
	TokenAttributes,
	"id" | "expiresAt" | "invalidatedAt"
>;

export interface AttendanceAttributes {
	id: string;
	userId: string;
	loginAt: Date;
	logoutAt?: Date | null;
	ipAddress?: string | null;
	deviceInfo?: string | null;
	overtimeNotifiedAt?: Date | null;
}

export type AttendanceCreationAttributes = Optional<
	AttendanceAttributes,
	"id" | "logoutAt" | "ipAddress" | "deviceInfo" | "overtimeNotifiedAt"
>;

export interface AuditLogAttributes {
	id: string;
	actorId?: string | null;
	action: string;
	entityType: string;
	entityId?: string | null;
	description: string;
	metadata?: Record<string, unknown> | null;
}

export type AuditLogCreationAttributes = Optional<
	AuditLogAttributes,
	"id" | "actorId" | "entityId" | "metadata"
>;

export interface AccountAttributes {
	id: string;
	userId: string;
	bankName: string;
	accountNumber: number;
	accountName: string;
	statusId: string;
}

export type AccountCreationAttributes = Optional<AccountAttributes, "id">;

export type LeaveDurationUnit = "days" | "weeks" | "months";

export interface LeaveAttributes {
	id: string;
	userId: string;
	leaveName: string;
	leaveType: "annual" | "sick" | "unpaid" | "maternity" | "paternity" | "other";
	duration: number;
	durationUnit: LeaveDurationUnit;
	startDate: string;
	endDate: string;
	reason?: string | null;
	statusId: string;
	approvedById?: string | null;
}

export type LeaveCreationAttributes = Optional<
	LeaveAttributes,
	"id" | "reason" | "approvedById"
>;

export type PayrollRecordCreationAttributes = Optional<
	PayrollRecordAttributes,
	"id" | "notes"
>;

export interface PayrollRecordAttributes {
	id: string;
	userId: string;
	periodStart: string;
	periodEnd: string;
	grossSalary: number;
	deductions: number;
	netSalary: number;
	statusId: string;
	notes?: string | null;
}

export interface PaginationQuery {
	page?: string;
	limit?: string;
	search?: string;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	departmentId?: string;
	roleId?: string;
	statusId?: string;
	positionId?: string;
	employmentTypeId?: string;
	managerId?: string;
	category?: string;
	date?: string;
	startDate?: string;
	endDate?: string;
}
