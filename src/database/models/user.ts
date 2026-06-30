import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../../types/model";
import { Role } from "./role";
import { Department } from "./department";
import { Position } from "./position";
import { Status } from "./status";
import { EmploymentType } from "./employmentType";
import { Account } from "./account";
import { Token } from "./token";
import { Attendance } from "./attendance";
import { AuditLog } from "./auditLog";
import { Leave } from "./leave";
import { PayrollRecord } from "./payrollRecord";

export class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	declare id: string;
	declare employeeCode: string;
	declare firstName: string;
	declare lastName: string;
	declare email: string;
	declare phone: string | null;
	declare password: string;
	declare positionId: string | null;
	declare departmentId: string | null;
	declare roleId: string | null;
	declare managerId: string | null;
	declare employmentTypeId: string | null;
	declare salary: number | null;
	declare statusId: string;
	declare profilePicture: string | null;
	declare address: string | null;
	declare emergencyContactName: string | null;
	declare emergencyContactPhone: string | null;
	declare emergencyContactRelation: string | null;
	declare dateJoined: string;
	declare lastPasswordChanged: Date | null;

	static associate(models: {
		Role: typeof Role;
		Department: typeof Department;
		Position: typeof Position;
		Status: typeof Status;
		EmploymentType: typeof EmploymentType;
		Account: typeof Account;
		Token: typeof Token;
		Attendance: typeof Attendance;
		AuditLog: typeof AuditLog;
		Leave: typeof Leave;
		PayrollRecord: typeof PayrollRecord;
		User: typeof User;
	}) {
		User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
		User.belongsTo(models.Department, {
			foreignKey: "departmentId",
			as: "department",
		});
		User.belongsTo(models.Position, {
			foreignKey: "positionId",
			as: "position",
		});
		User.belongsTo(models.Status, { foreignKey: "statusId", as: "status" });
		User.belongsTo(models.EmploymentType, {
			foreignKey: "employmentTypeId",
			as: "employmentType",
		});
		User.belongsTo(models.User, { foreignKey: "managerId", as: "manager" });
		User.hasMany(models.User, { foreignKey: "managerId", as: "team" });
		User.hasMany(models.Account, { foreignKey: "userId", as: "accounts" });
		User.hasMany(models.Token, { foreignKey: "userId", as: "tokens" });
		User.hasMany(models.Attendance, {
			foreignKey: "userId",
			as: "attendance",
		});
		User.hasMany(models.AuditLog, { foreignKey: "actorId", as: "auditLogs" });
		User.hasMany(models.Leave, { foreignKey: "userId", as: "leaves" });
		User.hasMany(models.PayrollRecord, {
			foreignKey: "userId",
			as: "payrollRecords",
		});
	}
}

const userModel = (sequelize: Sequelize) => {
	User.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			employeeCode: { type: DataTypes.STRING, allowNull: false, unique: true },
			firstName: { type: DataTypes.STRING, allowNull: false },
			lastName: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, allowNull: false, unique: true },
			phone: { type: DataTypes.STRING, allowNull: true },
			password: { type: DataTypes.STRING, allowNull: false },
			positionId: { type: DataTypes.UUID, allowNull: true },
			departmentId: { type: DataTypes.UUID, allowNull: true },
			roleId: { type: DataTypes.UUID, allowNull: true },
			managerId: { type: DataTypes.UUID, allowNull: true },
			employmentTypeId: { type: DataTypes.UUID, allowNull: true },
			salary: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
			statusId: { type: DataTypes.UUID, allowNull: false },
			profilePicture: { type: DataTypes.STRING, allowNull: true },
			address: { type: DataTypes.TEXT, allowNull: true },
			emergencyContactName: { type: DataTypes.STRING, allowNull: true },
			emergencyContactPhone: { type: DataTypes.STRING, allowNull: true },
			emergencyContactRelation: { type: DataTypes.STRING, allowNull: true },
			dateJoined: { type: DataTypes.DATEONLY, allowNull: false },
			lastPasswordChanged: { type: DataTypes.DATE, allowNull: true },
		},
		{ sequelize, tableName: "users" },
	);
	return User;
};

export default userModel;
