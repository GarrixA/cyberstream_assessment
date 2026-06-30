import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { RoleAttributes, RoleCreationAttributes } from "../../types/model";

export class Role
	extends Model<RoleAttributes, RoleCreationAttributes>
	implements RoleAttributes
{
	declare id: string;
	declare name: string;
	declare description: string | null;
	declare statusId: string;
	declare setPermissions: (permissionIds: string[]) => Promise<void>;

	static associate(models: Record<string, typeof Model>) {
		Role.belongsTo(models.Status as never, { foreignKey: "statusId", as: "status" });
		Role.belongsToMany(models.Permission as never, {
			through: models.RolePermission as never,
			foreignKey: "roleId",
			otherKey: "permissionId",
			as: "permissions",
		});
		Role.hasMany(models.User as never, { foreignKey: "roleId", as: "users" });
	}
}

const roleModel = (sequelize: Sequelize) => {
	Role.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			name: { type: DataTypes.STRING, allowNull: false, unique: true },
			description: { type: DataTypes.STRING, allowNull: true },
			statusId: { type: DataTypes.UUID, allowNull: false },
		},
		{ sequelize, tableName: "roles" },
	);
	return Role;
};

export default roleModel;
