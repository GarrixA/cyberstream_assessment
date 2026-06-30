import basicInfo from "./basicInfo";
import { health, root } from "./root";
import authPaths from "./auth";
import employeePaths from "./employees";
import departmentPaths from "./departments";
import rolePaths from "./roles";
import leavePaths from "./leaves";
import payrollPaths from "./payroll";
import statusPaths from "./statuses";
import permissionPaths from "./permissions";
import positionPaths from "./positions";
import employmentTypePaths from "./employment-types";
import resourcePaths from "./resources";

export default {
	...basicInfo,
	paths: {
		...health,
		...root,
		...authPaths,
		...employeePaths,
		...departmentPaths,
		...rolePaths,
		...leavePaths,
		...payrollPaths,
		...statusPaths,
		...permissionPaths,
		...positionPaths,
		...employmentTypePaths,
		...resourcePaths,
	},
};
