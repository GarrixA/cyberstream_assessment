import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { StatusAttributes, StatusCreationAttributes } from "../../types/model";

export class Status
	extends Model<StatusAttributes, StatusCreationAttributes>
	implements StatusAttributes
{
	declare id: string;
	declare name: string;
	declare category: StatusAttributes["category"];
	declare description: string | null;
}

const statusModel = (sequelize: Sequelize) => {
	Status.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false },
			category: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.STRING, allowNull: true },
		},
		{ sequelize, tableName: "statuses" },
	);
	return Status;
};

export default statusModel;
