import { Joi } from './joi';

const categoryType = Joi.number().required();
const displayName = Joi.string().min(3).max(128).trim().required();
const description = Joi.string().min(3).max(128);

const categorySchema = Joi.object({
  categoryType,
  displayName,
  description,
});
