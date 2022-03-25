import { NextFunction, Response } from "express";
import { IReqAuth } from "../config/interface";

const authorize =
  (role: string) =>
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      if (!req.user)
        return res.status(400).json({ msg: "Invalid Authentication." });

      if (req.user.role !== role)
        return res.status(400).json({ msg: " UnAuthorize." });
      next();
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  };

export default authorize;
