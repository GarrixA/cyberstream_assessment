import app from "./app";
import { connectionToDatabase } from "./database/config/db.config";
import { startAttendanceMonitor } from "./services/attendance.monitor.service";
import { PORT } from "./utils/keys";

const startServer = async () => {
	await connectionToDatabase();
	startAttendanceMonitor();

	app.listen(PORT, () => {
		console.log(`Server is running at http://localhost:${PORT}`);
	});
};

startServer();
