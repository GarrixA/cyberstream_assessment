import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
	AuditLogAttributes,
	AuditLogCreationAttributes,
} from "../../types/model";
import { User } from "./user";

export class AuditLog
	extends Model<AuditLogAttributes, AuditLogCreationAttributes>
	implements AuditLogAttributes
{
	declare id: string;
	declare actorId: string | null;
	declare action: string;
	declare entityType: string;
	declare entityId: string | null;
	declare description: string;
	declare metadata: Record<string, unknown> | null;

	static associate(models: { User: typeof User }) {
		AuditLog.belongsTo(models.User, { foreignKey: "actorId", as: "actor" });
	}
}

const auditLogModel = (sequelize: Sequelize) => {
	AuditLog.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			actorId: { type: DataTypes.UUID, allowNull: true },
			action: { type: DataTypes.STRING, allowNull: false },
			entityType: { type: DataTypes.STRING, allowNull: false },
			entityId: { type: DataTypes.UUID, allowNull: true },
			description: { type: DataTypes.TEXT, allowNull: false },
			metadata: { type: DataTypes.JSONB, allowNull: true },
		},
		{ sequelize, tableName: "audit_logs" },
	);
	return AuditLog;
};

export default auditLogModel;
