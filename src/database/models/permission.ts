import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
	PermissionAttributes,
	PermissionCreationAttributes,
} from "../../types/model";

export class Permission
	extends Model<PermissionAttributes, PermissionCreationAttributes>
	implements PermissionAttributes
{
	declare id: string;
	declare code: string;
	declare name: string;
	declare description: string | null;

	static associate(models: Record<string, typeof Model>) {
		Permission.belongsToMany(models.Role as never, {
			through: models.RolePermission as never,
			foreignKey: "permissionId",
			otherKey: "roleId",
			as: "roles",
		});
	}
}

const permissionModel = (sequelize: Sequelize) => {
	Permission.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			code: { type: DataTypes.STRING, allowNull: false, unique: true },
			name: { type: DataTypes.STRING, allowNull: false },
			description: { type: DataTypes.STRING, allowNull: true },
		},
		{ sequelize, tableName: "permissions" },
	);
	return Permission;
};

export default permissionModel;
