import nodemailer, { SendMailOptions } from 'nodemailer';
import { MAIL_FROM } from '../config';

const { SMTP_USERNAME, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: 'server139.web-hosting.com',
  port: 587,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

export const sendMail = async (options: SendMailOptions) =>
  await transporter.sendMail({
    ...options,
    from: MAIL_FROM,
    replyTo: 'contact@pinnasofts.com',
  });
