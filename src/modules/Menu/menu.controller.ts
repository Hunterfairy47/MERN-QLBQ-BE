import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import DishDetails from '../Dish/dishDetail.model';
import Menu from './menu.model';
import MenuDetails from './menuDetail.model';
const ObjectId = mongoose.Types.ObjectId;

const menuController = {
  getMenuDetailsById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const menuDetail = await MenuDetails.aggregate([
        {
          $match: {
            date: new Date('2020-03-22T17:00:00.000+00:00'),
          },
        },
        {
          $lookup: {
            from: 'dishes',
            localField: 'dishId',
            foreignField: '_id',
            as: 'dishes',
          },
        },
        {
          $unwind: '$dishes',
        },
        {
          $lookup: {
            from: 'ingredients',
            localField: 'dishes.ingredients',
            foreignField: '_id',
            as: 'dishes.ingredients',
          },
        },
      ]);

      Result.success(res, { message: 'Get success!', menuDetail });
    } catch (error) {
      next(error);
    }
  },

  updateMenuDetailsById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let list = req.body;
      let day = req.params.id;
      const date = await MenuDetails.find({ date: day });
      for (let i = 0; i < date.length; i++) {
        for (let j = 0; j < list.data.length; j++) {
          if (list.data[j].dishId === date[i].dishId && day === '2020-03-22T17:00:00.000+00:00') {
            await DishDetails.create({
              menuDetailsId: date[i]._id,
              ...list.data[i],
            });
          }
        }
      }
      Result.success(res, { message: 'Post success!' });
    } catch (error) {
      next(error);
    }
  },

  createMenu: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.body;
      const menus = await Menu.findOne({ _id });
      if (menus) return Result.error(res, { message: 'Menu already exists!' });
      const newMenu = new Menu(req.body);
      await newMenu.save();

      Result.success(res, { message: 'Create success!' });
    } catch (error: any) {
      next(error);
    }
  },

  createMenuDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data = req.body.data;
      let menuId = req.body.menuId;
      for (let i = 0; i < data.length; i++) {
        const newMenuDetails = new MenuDetails({ ...data[i], menuId });
        await newMenuDetails.save();
      }

      Result.success(res, { message: 'Create success!' });
    } catch (error: any) {
      next(error);
    }
  },
};

export default menuController;
