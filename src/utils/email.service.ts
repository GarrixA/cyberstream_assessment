import sendMail from "./sendEmail";
import { CLIENT_URL, SERVER_URL } from "./keys";

const appUrl = () => CLIENT_URL ?? SERVER_URL ?? "http://localhost:8081";

const buttonStyle =
	"display: inline-block; background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;";

export const sendPasswordResetEmail = async (params: {
	email: string;
	firstName: string;
	resetCode: string;
	resetToken: string;
}) => {
	const resetUrl = `${appUrl()}/reset-password?token=${encodeURIComponent(params.resetToken)}`;

	await sendMail(
		params.email,
		"Reset your CyberStream password",
		`
			<p>Hi ${params.firstName},</p>
			<p>We received a request to reset your password. Click the button below or enter the code on the reset page. This link and code expire in 15 minutes.</p>
			<p><a href="${resetUrl}" style="${buttonStyle}">Reset password</a></p>
			<p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2e7d32;">${params.resetCode}</p>
			<p>If you did not request this, you can safely ignore this email.</p>
			<p style="word-break: break-all; font-size: 12px; color: #666;">${resetUrl}</p>
		`,
	);
};

export const sendPasswordResetConfirmationEmail = async (params: {
	email: string;
	firstName: string;
}) => {
	await sendMail(
		params.email,
		"Your CyberStream password was reset",
		`
			<p>Hi ${params.firstName},</p>
			<p>Your CyberStream password was changed successfully.</p>
			<p>If you did not make this change, contact your administrator immediately.</p>
		`,
	);
};

export const sendAttendanceOvertimeEmail = async (params: {
	email: string;
	firstName: string;
}) => {
	await sendMail(
		params.email,
		"Time to head home",
		`
			<p>Hi ${params.firstName},</p>
			<p>You should go home, I am good boss 😃</p>
			<p>Your attendance session has exceeded the allowed duration. Please log out when you wrap up.</p>
		`,
	);
};

export const sendEmployeeWelcomeEmail = async (params: {
	email: string;
	firstName: string;
	lastName: string;
	employeeCode: string;
	temporaryPassword: string;
}) => {
	const loginUrl = `${appUrl()}/login`;

	await sendMail(
		params.email,
		"Welcome to CyberStream",
		`
			<p>Hi ${params.firstName} ${params.lastName},</p>
			<p>Your CyberStream employee account has been created. Use the credentials below to sign in and change your password after your first login.</p>
			<table style="margin: 16px 0; border-collapse: collapse;">
				<tr>
					<td style="padding: 8px 12px; font-weight: bold;">Employee code</td>
					<td style="padding: 8px 12px;">${params.employeeCode}</td>
				</tr>
				<tr>
					<td style="padding: 8px 12px; font-weight: bold;">Email</td>
					<td style="padding: 8px 12px;">${params.email}</td>
				</tr>
				<tr>
					<td style="padding: 8px 12px; font-weight: bold;">Temporary password</td>
					<td style="padding: 8px 12px;">${params.temporaryPassword}</td>
				</tr>
			</table>
			<p><a href="${loginUrl}" style="${buttonStyle}">Sign in to CyberStream</a></p>
		`,
	);
};
