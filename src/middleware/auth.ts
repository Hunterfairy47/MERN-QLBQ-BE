import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IDecodedToken, IReqAuth } from '../config/interface';
import Users from '../modules/Auth/auth.model';

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;

    if (!token) return res.status(500).json({ msg: 'No token provided' });

    token = token.split(' ')[1];
    const decoded = <IDecodedToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    if (!decoded) return res.status(500).json({ msg: 'UnAuthorization' });

    const user = await Users.findOne({ _id: decoded.id });
    if (!user) return res.status(500).json({ msg: 'User does not exist.' });
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(500).json({ msg: error.message });
  }
};

export default auth;
