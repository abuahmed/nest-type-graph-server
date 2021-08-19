import { Joi } from './joi';
//import Joi from '@hapi/joi';
const id = Joi.number().required();

const email = Joi.string().email().min(8).max(254).lowercase().trim().required();

const name = Joi.string().min(3).max(128).trim().required();

const displayName = Joi.string().min(3).max(128).trim().required();

const password = Joi.string().min(6).max(20).required();
// const password = Joi.string().min(8)
//     .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
//     .message('"{#label}" must contain one uppercase letter, one lowercase letter, and one digit')
//     .required()

const confirmPassword = Joi.valid(Joi.ref('password')).required();

export const registerSchema = Joi.object({
  email,
  name,
  password,
  confirmPassword,
});

export const loginSchema = Joi.object({
  email,
  password,
});

export const verifyEmailSchema = Joi.object({
  id,
  token: Joi.string().length(40).required(),
  expires: Joi.date().timestamp().required(),
  signature: Joi.string().length(64).required(),
});

export const resendEmailSchema = Joi.object({
  id,
});

export const displaySchema = Joi.object({
  displayName,
});

export const forgotPasswordSchema = Joi.object({
  email,
});
//const prb = Number(String(PASSWORD_RESET_BYTES));
export const resetPasswordSchema = Joi.object({
  // query: Joi.object({
  //     id,
  //     token: Joi.string().length(40 * 2).required()
  // }),
  body: Joi.object({
    id,
    token: Joi.string()
      .length(40 * 2)
      .required(),
    password,
    confirmPassword,
  }),
});

// const roleName = Joi.string().min(3).max(128).trim().required()

// export const roleSchema = Joi.object({
//   roleName
// })

// const { check } = require('express-validator');

// const userSignupValidator = [
//   check('name').not().isEmpty().withMessage('Name is required'),
//   check('email').isEmail().withMessage('Must be a valid email address'),
//   check('password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least  6 characters long'),
// ];

// const userSigninValidator = [
//   check('email').isEmail().withMessage('Must be a valid email address'),
//   check('password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least  6 characters long'),
// ];

// const forgotPasswordValidator = [
//   check('email')
//     .not()
//     .isEmpty()
//     .isEmail()
//     .withMessage('Must be a valid email address'),
// ];

// const resetPasswordValidator = [
//   check('newPassword')
//     .not()
//     .isEmpty()
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least  6 characters long'),
// ];

// export {
// userSignupValidator,userSigninValidator,forgotPasswordValidator,resetPasswordValidator
// }
