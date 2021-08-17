// import { SessionOptions } from 'express-session'
import { IN_PROD } from './app';

export const {
  //ONE_HOUR,
  SESSION_SECRET,
  SESSION_NAME,
  SESSION_IDLE_TIMEOUT,
} = process.env;

// export const SESSION_ABSOLUTE_TIMEOUT = +(env.SESSION_ABSOLUTE_TIMEOUT || 6 * ONE_HOUR)

// export const SESSION_OPTIONS: SessionOptions = {
//   secret: <string>SESSION_SECRET,
//   name: SESSION_NAME,
//   cookie: {
//     maxAge: SESSION_IDLE_TIMEOUT ? +SESSION_IDLE_TIMEOUT : 0,
//     secure: IN_PROD,
//     sameSite: true
//   },
//   rolling: true,
//   resave: false,
//   saveUninitialized: false
// }
