import { Options } from 'nodemailer/lib/smtp-connection';

import { APP_HOSTNAME } from './app';

const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

export const SMTP_OPTIONS: Options = {
  host: SMTP_HOST,
  port: SMTP_PORT ? +SMTP_PORT : 587,
  secure: false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
};

export const MAIL_FROM = `PinnaSofts <no-reply@${APP_HOSTNAME}>`;
