import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { PositionAttributes, PositionCreationAttributes } from "../../types/model";
import { Department } from "./department";
import { Status } from "./status";
import { User } from "./user";

export class Position
	extends Model<PositionAttributes, PositionCreationAttributes>
	implements PositionAttributes
{
	declare id: string;
	declare title: string;
	declare description: string | null;
	declare departmentId: string | null;
	declare statusId: string;

	static associate(models: {
		Department: typeof Department;
		Status: typeof Status;
		User: typeof User;
	}) {
		Position.belongsTo(models.Department, {
			foreignKey: "departmentId",
			as: "department",
		});
		Position.belongsTo(models.Status, {
			foreignKey: "statusId",
			as: "status",
		});
		Position.hasMany(models.User, { foreignKey: "positionId", as: "users" });
	}
}

const positionModel = (sequelize: Sequelize) => {
	Position.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			title: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.STRING, allowNull: true },
			departmentId: { type: DataTypes.UUID, allowNull: true },
			statusId: { type: DataTypes.UUID, allowNull: false },
		},
		{ sequelize, tableName: "positions" },
	);
	return Position;
};

export default positionModel;
