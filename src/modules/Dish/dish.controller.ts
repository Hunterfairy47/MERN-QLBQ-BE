import { Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import Dish from './dish.model';

const dishController = {
  getDish: async (req: Request, res: Response) => {
    try {
      let Dishes = [];
      let typeDishId: string = (req.query.typedishId as string) || '';
      // get dish by type of dish
      if (req.query.typedishId) {
        Dishes = await Dish.find({ typeDishId: typeDishId });
      } else {
        //get all dish
        Dishes = await Dish.find();
      }
      Result.success(res, { message: 'Get Success', Dishes });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  createDish: async (req: IReqAuth, res: Response) => {
    try {
      const { dishName } = req.body;
      const dish = await Dish.findOne({ dishName });

      if (dish) return Result.error(res, { message: 'Dish already exists!' });
      const newDish = new Dish(req.body);
      await newDish.save();

      Result.success(res, { message: 'create success!' });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exits.';
      } else {
        let name = Object.keys(error.errors)[0];
        errMsg = error.errors[`${name}`].message;
      }
      return Result.error(res, { message: errMsg });
    }
  },
};

export default dishController;
