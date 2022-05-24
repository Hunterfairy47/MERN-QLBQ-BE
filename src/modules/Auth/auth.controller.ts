import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IDecodedToken } from '../../config/interface';
import sendEmail from '../../config/senMail';
import { generateAccessToken, generateActiveToken } from '../../utils/generateToken';
import Result from '../../utils/result';
import Users from './auth.model';
import { validateEmail } from './auth.validate';

const CLIENT_URL = `${process.env.BASE_URL}`;

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { firstname, lastname, phone, office, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) return Result.error(res, { message: 'Email already exists!' }, 401);

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        firstname,
        lastname,
        phone,
        office,
        email,
        password: passwordHash,
      };

      const active_token = generateActiveToken({ newUser });
      const user1 = new Users(newUser);
      await user1.save();

      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(email)) {
        sendEmail(email, url, 'Verify your email address');
        res.json({
          msg: 'Success! Please check your email.',
        });
      }
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

      const { newUser } = decoded;

      if (!newUser) return Result.error(res, { message: 'Invalid authentication.' });
      const user = new Users(newUser);

      await user.save();
      Result.success(res, {
        message: `Account has been verify by ${newUser.email} ! waiting until management active your account!`,
      });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + 'already exits.';
      }
      return Result.error(res, { message: errMsg });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user) {
        return Result.error(res, { message: 'This account does not exits.' }, 401);
      }

      //if user exits
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return Result.error(res, { message: 'Password is incorrect.' });
      }

      const access_token = generateAccessToken(user);

      Result.success(res, { access_token, user });
    } catch (error: any) {
      return Result.error(res, { message: error });
    }
  },
};

export default authController;
