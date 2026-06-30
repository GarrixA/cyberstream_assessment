import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";

export class RolePermission extends Model {
	declare id: string;
	declare roleId: string;
	declare permissionId: string;
}

const rolePermissionModel = (sequelize: Sequelize) => {
	RolePermission.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			roleId: { type: DataTypes.UUID, allowNull: false },
			permissionId: { type: DataTypes.UUID, allowNull: false },
		},
		{ sequelize, tableName: "role_permissions" },
	);
	return RolePermission;
};

export default rolePermissionModel;
