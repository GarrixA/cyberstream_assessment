import { Response } from "express";

export const sendResponse = (
	res: Response,
	statusCode: number,
	status: string,
	message: string,
	data?: unknown,
) => {
	const payload: Record<string, unknown> = { status, message };
	if (data !== undefined) payload.data = data;
	return res.status(statusCode).json(payload);
};
