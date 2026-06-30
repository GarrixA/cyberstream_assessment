import { RequestHandler } from "express";

export function setup(
	swaggerDoc?: object,
	customOptions?: object,
): RequestHandler;

export const serve: RequestHandler[];
