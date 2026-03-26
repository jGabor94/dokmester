import SMTPTransport from "nodemailer/lib/smtp-transport";

export const options : SMTPTransport.Options = {
  host: process.env.SMTP_HOST ?? 'localhost',
  port: process.env.SMTP_PORT as unknown as number,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
}