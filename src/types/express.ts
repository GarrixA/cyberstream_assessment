import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload extends JwtPayload {
	id: string;
	email: string;
	roleId: string;
	roleName: string;
	permissions: string[];
}

export interface AuthRequest extends Request {
	user?: AuthUserPayload;
}
