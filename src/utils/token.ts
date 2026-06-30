import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./keys";

export const signAccessToken = (payload: Record<string, unknown>) => {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: "8h" });
};

export const signResetToken = (payload: Record<string, unknown>) => {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, ACCESS_TOKEN_SECRET as string);
};
