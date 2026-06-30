import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
	PayrollRecordAttributes,
	PayrollRecordCreationAttributes,
} from "../../types/model";
import { User } from "./user";
import { Status } from "./status";

export class PayrollRecord
	extends Model<PayrollRecordAttributes, PayrollRecordCreationAttributes>
	implements PayrollRecordAttributes
{
	declare id: string;
	declare userId: string;
	declare periodStart: string;
	declare periodEnd: string;
	declare grossSalary: number;
	declare deductions: number;
	declare netSalary: number;
	declare statusId: string;
	declare notes: string | null;

	static associate(models: { User: typeof User; Status: typeof Status }) {
		PayrollRecord.belongsTo(models.User, { foreignKey: "userId", as: "employee" });
		PayrollRecord.belongsTo(models.Status, {
			foreignKey: "statusId",
			as: "status",
		});
	}
}

const payrollRecordModel = (sequelize: Sequelize) => {
	PayrollRecord.init(
		{
			id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
			userId: { type: DataTypes.UUID, allowNull: false },
			periodStart: { type: DataTypes.DATEONLY, allowNull: false },
			periodEnd: { type: DataTypes.DATEONLY, allowNull: false },
			grossSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
			deductions: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false,
				defaultValue: 0,
			},
			netSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
			statusId: { type: DataTypes.UUID, allowNull: false },
			notes: { type: DataTypes.TEXT, allowNull: true },
		},
		{ sequelize, tableName: "payroll_records" },
	);
	return PayrollRecord;
};

export default payrollRecordModel;
