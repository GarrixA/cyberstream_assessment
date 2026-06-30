import crypto from "crypto";
import bcrypt from "bcrypt";

const PASSWORD_CHARSET =
	"abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";

export const generatePassword = (length = 12): string => {
	const bytes = crypto.randomBytes(length);
	return Array.from(bytes, (b) => PASSWORD_CHARSET[b % PASSWORD_CHARSET.length]).join(
		"",
	);
};

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};
