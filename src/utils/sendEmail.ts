import nodemailer from "nodemailer";
import {
	SMTP_FROM,
	SMTP_HOST,
	SMTP_PASS,
	SMTP_PORT,
	SMTP_USER,
} from "./keys";

const emailTemplate = (message: string, subject: string) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2e7d32;">${subject}</h2>
      <div>${message}</div>
      <hr style="margin-top: 24px; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888;">CyberStream</p>
    </div>
  </body>
</html>
`;

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: SMTP_PORT === 465,
	auth:
		SMTP_USER && SMTP_PASS
			? { user: SMTP_USER, pass: SMTP_PASS }
			: undefined,
});

export const sendMail = async (to: string, subject: string, message: string) => {
	if (!SMTP_USER || !SMTP_PASS) {
		throw new Error("SMTP credentials are not configured");
	}

	console.log(`[email] Sending to ${to} | subject: ${subject}`);

	try {
		const info = await transporter.sendMail({
			from: SMTP_FROM ?? SMTP_USER,
			to,
			subject,
			html: emailTemplate(message, subject),
		});

		console.log(
			`[email] Sent to ${to} | messageId: ${info.messageId} | response: ${info.response}`,
		);

		return info;
	} catch (error) {
		console.error(
			`[email] Failed to send to ${to} | subject: ${subject} | error: ${(error as Error).message}`,
		);
		throw error;
	}
};

export default sendMail;
