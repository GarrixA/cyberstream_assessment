import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { AccountAttributes, AccountCreationAttributes } from "../../types/model";
import { User } from "./user";
import { Status } from "./status";

export class Account
	extends Model<AccountAttributes, AccountCreationAttributes>
	implements AccountAttributes
{
	declare id: string;
	declare userId: string;
	declare bankName: string;
	declare accountNumber: number;
	declare accountName: string;
	declare statusId: string;

	static associate(models: { User: typeof User; Status: typeof Status }) {
		Account.belongsTo(models.User, { foreignKey: "userId", as: "user" });
		Account.belongsTo(models.Status, { foreignKey: "statusId", as: "status" });
	}
}

const accountModel = (sequelize: Sequelize) => {
	Account.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			userId: { type: DataTypes.UUID, allowNull: false },
			bankName: { type: DataTypes.STRING, allowNull: false },
			accountNumber: { type: DataTypes.BIGINT, allowNull: false },
			accountName: { type: DataTypes.STRING, allowNull: false },
			statusId: { type: DataTypes.UUID, allowNull: false },
		},
		{ sequelize, tableName: "accounts" },
	);
	return Account;
};

export default accountModel;
