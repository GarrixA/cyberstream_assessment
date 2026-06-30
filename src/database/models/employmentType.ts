import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { EmploymentTypeAttributes, EmploymentTypeCreationAttributes } from "../../types/model";

export class EmploymentType
	extends Model<EmploymentTypeAttributes, EmploymentTypeCreationAttributes>
	implements EmploymentTypeAttributes
{
	declare id: string;
	declare name: string;
	declare description: string | null;
}

const employmentTypeModel = (sequelize: Sequelize) => {
	EmploymentType.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false, unique: true },
			description: { type: DataTypes.STRING, allowNull: true },
		},
		{ sequelize, tableName: "employment_types" },
	);
	return EmploymentType;
};

export default employmentTypeModel;
