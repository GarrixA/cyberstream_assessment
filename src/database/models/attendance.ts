import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
	AttendanceAttributes,
	AttendanceCreationAttributes,
} from "../../types/model";
import { User } from "./user";

export class Attendance
	extends Model<AttendanceAttributes, AttendanceCreationAttributes>
	implements AttendanceAttributes
{
	declare id: string;
	declare userId: string;
	declare loginAt: Date;
	declare logoutAt: Date | null;
	declare ipAddress: string | null;
	declare deviceInfo: string | null;
	declare overtimeNotifiedAt: Date | null;

	static associate(models: { User: typeof User }) {
		Attendance.belongsTo(models.User, { foreignKey: "userId", as: "user" });
	}
}

const attendanceModel = (sequelize: Sequelize) => {
	Attendance.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			userId: { type: DataTypes.UUID, allowNull: false },
			loginAt: { type: DataTypes.DATE, allowNull: false },
			logoutAt: { type: DataTypes.DATE, allowNull: true },
			ipAddress: { type: DataTypes.STRING, allowNull: true },
			deviceInfo: { type: DataTypes.STRING, allowNull: true },
			overtimeNotifiedAt: { type: DataTypes.DATE, allowNull: true },
		},
		{ sequelize, tableName: "attendance" },
	);
	return Attendance;
};

export default attendanceModel;
