import jwt from 'jsonwebtoken';
//const { JWT_SECRET } = process.env
import { JWT_SECRET } from '../config';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, <string>JWT_SECRET, {
    expiresIn: '30d',
    algorithm: 'HS256',
  });
};

export default generateToken;
