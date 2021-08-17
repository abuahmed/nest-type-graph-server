import nodemailer, { SendMailOptions } from 'nodemailer';
import { MAIL_FROM } from '../config';

const { SMTP_USERNAME, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

export const sendMail = (options: SendMailOptions) =>
  transporter.sendMail({
    ...options,
    from: MAIL_FROM,
    replyTo: 'contact@pinnasofts.com',
  });
