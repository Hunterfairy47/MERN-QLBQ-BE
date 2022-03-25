import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IReqAuth } from '../../config/interface';
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
            _id: ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: 'dishes',
            localField: 'dishIds',
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
      res.json({ msg: 'get success!', menuDetail });
    } catch (error) {
      next(error);
    }
  },

  updateMenuDetailsById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let list = req.body;
      for (let i = 0; i < list.data.length; i++) {
        await DishDetails.create({
          menuDetailsId: req.params.id,
          ...list.data[i],
        });
      }
      res.json({ msg: 'get success!' });
    } catch (error) {
      next(error);
    }
  },

  createMenu: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.body;
      const menus = await Menu.findOne({ _id });
      if (menus) return res.status(400).json({ msg: 'Menu already exists!' });
      const newMenu = new Menu(req.body);
      await newMenu.save();
      res.json({ msg: 'create success!' });
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

      res.json({ msg: 'create success!' });
    } catch (error: any) {
      next(error);
    }
  },
};

export default menuController;
