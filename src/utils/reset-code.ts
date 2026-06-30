import crypto from "crypto";

export const generateResetCode = () =>
	crypto.randomInt(100000, 999999).toString();
