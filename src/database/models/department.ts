import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { DepartmentAttributes, DepartmentCreationAttributes } from "../../types/model";
import { Status } from "./status";
import { User } from "./user";
import { Position } from "./position";

export class Department
	extends Model<DepartmentAttributes, DepartmentCreationAttributes>
	implements DepartmentAttributes
{
	declare id: string;
	declare name: string;
	declare description: string | null;
	declare statusId: string;
	declare managerId: string | null;

	static associate(models: {
		Status: typeof Status;
		User: typeof User;
		Position: typeof Position;
	}) {
		Department.belongsTo(models.Status, {
			foreignKey: "statusId",
			as: "status",
		});
		Department.belongsTo(models.User, {
			foreignKey: "managerId",
			as: "manager",
		});
		Department.hasMany(models.User, {
			foreignKey: "departmentId",
			as: "employees",
		});
		Department.hasMany(models.Position, {
			foreignKey: "departmentId",
			as: "positions",
		});
	}
}

const departmentModel = (sequelize: Sequelize) => {
	Department.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false, unique: true },
			description: { type: DataTypes.STRING, allowNull: true },
			statusId: { type: DataTypes.UUID, allowNull: false },
			managerId: { type: DataTypes.UUID, allowNull: true },
		},
		{ sequelize, tableName: "departments" },
	);
	return Department;
};

export default departmentModel;
