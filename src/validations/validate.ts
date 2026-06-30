import { NextFunction, Response } from "express";
import Joi from "joi";
import { AuthRequest } from "../types/express";
import { sendAppError } from "../utils/errors";

type RequestProperty = "body" | "query" | "params";

export const validate =
	(schema: Joi.ObjectSchema, property: RequestProperty = "body") =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		const { error, value } = schema.validate(req[property], {
			abortEarly: false,
			stripUnknown: true,
		});

		if (error) {
			const message = error.details.map((detail) => detail.message).join(", ");
			return sendAppError(res, "VALIDATION_ERROR", message);
		}

		req[property] = value;
		next();
	};
