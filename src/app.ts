import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import { root_home_page } from "./utils/html.utils";
import docs from "./documention";

const app = express();

const swaggerOptions = {
	validatorUrl: null,
};

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(
	"/api/v1/docs",
	...swaggerUi.serve,
	swaggerUi.setup(docs, { swaggerOptions }),
);

app.use("/api/v1", router);

app.get("/api/v1", (_req: Request, res: Response) => {
	res.status(200).json({
		message: "Welcome to CyberStream Employee Management API",
	});
});

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({
		status: "ok",
		message: "CyberStream is running",
	});
});

app.get("/", (_req: Request, res: Response) => {
	res.send(root_home_page);
});

export default app;
