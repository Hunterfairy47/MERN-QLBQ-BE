import { Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Dish from './dish.model';

const dishController = {
  getDish: async (req: Request, res: Response) => {
    try {
      let Dishes = [];
      let typeDishId: string = (req.query.typedishId as string) || '';
      console.log(typeDishId);

      // get dish by type of dish
      if (req.query.typedishId) {
        Dishes = await Dish.find({ typeDishId: typeDishId });
      } else {
        //get all dish
        Dishes = await Dish.find();
      }
      res.json({ msg: 'get success!', Dishes });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createDish: async (req: IReqAuth, res: Response) => {
    try {
      const { dishName } = req.body;
      const dish = await Dish.findOne({ dishName });
      if (dish) return res.status(400).json({ msg: 'Dish already exists!' });

      console.log('req.body', req.body);

      const newDish = new Dish(req.body);
      await newDish.save();
      res.json({ msg: 'create success!' });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exits.';
      } else {
        let name = Object.keys(error.errors)[0];
        errMsg = error.errors[`${name}`].message;
      }
      return res.status(500).json({ msg: errMsg });
    }
  },
};

export default dishController;
