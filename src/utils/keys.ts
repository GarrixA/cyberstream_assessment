export const PORT = process.env.PORT;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const DEPLOYED_URL = process.env.DEPLOYED_URL;
export const SERVER_URL = process.env.SERVER_URL;
export const CLIENT_URL = process.env.CLIENT_URL;
export const DEV_MODE = process.env.DEV_MODE;

export const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
export const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_FROM = process.env.SMTP_FROM;
