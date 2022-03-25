import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateActiveToken } from '../../config/generateToken';
import { IDecodedToken } from '../../config/interface';
import sendEmail from '../../config/senMail';
import Users from './auth.model';
import { validateEmail } from './auth.validate';

const CLIENT_URL = `${process.env.BASE_URL}`;

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { firstname, lastname, phone, office, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'Email already exists!' });

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

      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(email)) {
        sendEmail(email, url, 'Verify your email address');
        res.json({
          msg: 'Success! Please check your email.',
        });
      }
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);

      const { newUser } = decoded;

      if (!newUser) return res.status(400).json({ msg: 'Invalid authentication.' });
      const user = new Users(newUser);

      await user.save();
      res.json({
        msg: `Account has been verify by ${newUser.email} ! waiting until management active your account!`,
      });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + 'already exits.';
      }
      return res.status(500).json({ msg: errMsg });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'This account does not exits.' });
      }

      //if user exits
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Password is incorrect.' });
      }

      const access_token = generateAccessToken({ id: user._id });

      res.json({
        msg: 'Login Success!',
        access_token,
        user: user._doc,
      });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default authController;
