import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateActiveToken } from "../config/generateToken";
import { IDecodedToken } from "../config/interface";
import sendEmail from "../config/senMail";
import { validateEmail } from "../middleware/validRegister";
import Users from "../models/user";

const CLIENT_URL = `${process.env.BASE_URL}`;

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { firstname, lastname, phone, office, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "Email already exists!" });

      const passwordHash = await bcrypt.hash(password, 12);

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
        sendEmail(email, url, "Verify your email address");
        res.json({
          msg: "Success! Please check your email.",
        });
      }
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );

      const { newUser } = decoded;

      if (!newUser)
        return res.status(400).json({ msg: "Invalid authentication." });
      const user = new Users(newUser);

      await user.save();
      res.json({
        msg: `Account has been verify by ${newUser.email} ! waiting until management active your account!`,
      });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

export default authController;
