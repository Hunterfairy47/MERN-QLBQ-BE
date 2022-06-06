import jwt from 'jsonwebtoken';
import { INewUser } from '../config/interface';

export const generateActiveToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, {
    expiresIn: '5m',
  });
};

export const generateAccessToken = (payload: INewUser) => {
  return jwt.sign({ id: payload._id }, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: '30d',
  });
};
