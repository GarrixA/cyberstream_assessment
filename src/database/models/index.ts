import { Sequelize } from "sequelize";
import statusModel from "./status";
import permissionModel from "./permission";
import employmentTypeModel from "./employmentType";
import roleModel from "./role";
import rolePermissionModel from "./rolePermission";
import departmentModel from "./department";
import positionModel from "./position";
import userModel from "./user";
import accountModel from "./account";
import tokenModel from "./token";
import attendanceModel from "./attendance";
import auditLogModel from "./auditLog";
import leaveModel from "./leave";
import payrollRecordModel from "./payrollRecord";

const Models = (sequelize: Sequelize) => {
	const Status = statusModel(sequelize);
	const Permission = permissionModel(sequelize);
	const EmploymentType = employmentTypeModel(sequelize);
	const Role = roleModel(sequelize);
	const RolePermission = rolePermissionModel(sequelize);
	const Department = departmentModel(sequelize);
	const Position = positionModel(sequelize);
	const User = userModel(sequelize);
	const Account = accountModel(sequelize);
	const Token = tokenModel(sequelize);
	const Attendance = attendanceModel(sequelize);
	const AuditLog = auditLogModel(sequelize);
	const Leave = leaveModel(sequelize);
	const PayrollRecord = payrollRecordModel(sequelize);

	return {
		Status,
		Permission,
		EmploymentType,
		Role,
		RolePermission,
		Department,
		Position,
		User,
		Account,
		Token,
		Attendance,
		AuditLog,
		Leave,
		PayrollRecord,
	};
};

export default Models;
