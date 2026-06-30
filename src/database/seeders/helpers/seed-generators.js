"use strict";

const crypto = require("crypto");

const PASSWORD_CHARSET =
	"abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";

function generateEmployeeCode(sequence) {
	return `EMP-${String(sequence).padStart(3, "0")}`;
}

function generatePassword(length = 12) {
	const bytes = crypto.randomBytes(length);
	return Array.from(bytes, (b) => PASSWORD_CHARSET[b % PASSWORD_CHARSET.length]).join(
		"",
	);
}

module.exports = {
	generateEmployeeCode,
	generatePassword,
};
