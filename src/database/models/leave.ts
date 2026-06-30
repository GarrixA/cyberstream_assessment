import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { LeaveAttributes, LeaveCreationAttributes } from "../../types/model";
import { User } from "./user";
import { Status } from "./status";

export class Leave
	extends Model<LeaveAttributes, LeaveCreationAttributes>
	implements LeaveAttributes
{
	declare id: string;
	declare userId: string;
	declare leaveName: string;
	declare leaveType: LeaveAttributes["leaveType"];
	declare duration: number;
	declare durationUnit: LeaveAttributes["durationUnit"];
	declare startDate: string;
	declare endDate: string;
	declare reason: string | null;
	declare statusId: string;
	declare approvedById: string | null;

	static associate(models: { User: typeof User; Status: typeof Status }) {
		Leave.belongsTo(models.User, { foreignKey: "userId", as: "employee" });
		Leave.belongsTo(models.User, {
			foreignKey: "approvedById",
			as: "approvedBy",
		});
		Leave.belongsTo(models.Status, { foreignKey: "statusId", as: "status" });
	}
}

const leaveModel = (sequelize: Sequelize) => {
	Leave.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			userId: { type: DataTypes.UUID, allowNull: false },
			leaveType: {
				type: DataTypes.ENUM(
					"annual",
					"sick",
					"unpaid",
					"maternity",
					"paternity",
					"other",
				),
				allowNull: false,
			},
			leaveName: { type: DataTypes.STRING, allowNull: false },
			duration: { type: DataTypes.INTEGER, allowNull: false },
			durationUnit: {
				type: DataTypes.ENUM("days", "weeks", "months"),
				allowNull: false,
			},
			startDate: { type: DataTypes.DATEONLY, allowNull: false },
			endDate: { type: DataTypes.DATEONLY, allowNull: false },
			reason: { type: DataTypes.TEXT, allowNull: true },
			statusId: { type: DataTypes.UUID, allowNull: false },
			approvedById: { type: DataTypes.UUID, allowNull: true },
		},
		{ sequelize, tableName: "leaves" },
	);
	return Leave;
};

export default leaveModel;
