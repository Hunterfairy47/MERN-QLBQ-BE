import { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Dish from "../models/dishModel";

const dishController = {
  getDish: async (req: Request, res: Response) => {
    try {
      let Dishes = [];
      if (req.query.typeDishId) {
        Dishes = await Dish.find({ typeDishId: req.query.typeDishId });
      } else {
        Dishes = await Dish.find();
      }
      res.json({ msg: "get success!", Dishes });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createDish: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    if (req.user.role !== "admin")
      return res.status(400).json({ msg: "Invalid Authentication." });
    try {
      const { dishName } = req.body;
      const dish = await Dish.findOne({ dishName });
      if (dish) return res.status(400).json({ msg: "Dish already exists!" });

      const newDish = new Dish(req.body);
      await newDish.save();
      res.json({ msg: "create success!" });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + " already exits.";
      } else {
        let name = Object.keys(error.errors)[0];
        errMsg = error.errors[`${name}`].message;
      }
      return res.status(500).json({ msg: errMsg });
    }
  },
};

export default dishController;
