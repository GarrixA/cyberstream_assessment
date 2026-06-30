import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { TokenAttributes, TokenCreationAttributes } from "../../types/model";
import { User } from "./user";
import { Status } from "./status";

export class Token
	extends Model<TokenAttributes, TokenCreationAttributes>
	implements TokenAttributes {
	declare id: string;
	declare userId: string;
	declare token: string;
	declare type: TokenAttributes["type"];
	declare statusId: string;
	declare expiresAt: Date | null;
	declare invalidatedAt: Date | null;

	static associate(models: { User: typeof User; Status: typeof Status }) {
		Token.belongsTo(models.User, { foreignKey: "userId", as: "user" });
		Token.belongsTo(models.Status, { foreignKey: "statusId", as: "status" });
	}
}

const tokenModel = (sequelize: Sequelize) => {
	Token.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			userId: { type: DataTypes.UUID, allowNull: false },
			token: { type: DataTypes.TEXT, allowNull: false },
			type: {
				type: DataTypes.ENUM("access", "refresh", "reset_password"),
				allowNull: false,
			},
			statusId: { type: DataTypes.UUID, allowNull: false },
			expiresAt: { type: DataTypes.DATE, allowNull: true },
			invalidatedAt: { type: DataTypes.DATE, allowNull: true },
		},
		{ sequelize, tableName: "tokens" },
	);
	return Token;
};

export default tokenModel;
