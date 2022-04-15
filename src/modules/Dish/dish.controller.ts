import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import TypeDish from '../TypeDish/typeDish.model';
import Dish from './dish.model';
const fs = require('fs');

const dishController = {
  getDish: async (req: Request, res: Response) => {
    try {
      let aggregate_options = [];
      let search = !!req.query._q;
      let match_regex = { $regex: req.query._q, $options: 'i' };

      aggregate_options.push(
        {
          $lookup: {
            from: 'typedishes',
            localField: 'typeDishId',
            foreignField: '_id',
            as: 'typeDishes',
          },
        },
        {
          $unwind: '$typeDishes',
        }
      );

      // Search
      if (search) {
        aggregate_options.push({
          $match: {
            $or: [{ dishName: match_regex }],
          },
        });
      }

      // Sorting
      let sort_order = req.query._order && req.query._order === 'asc' ? 1 : -1;
      let sort_by = req.query._sort || 'createdAt';
      aggregate_options.push({
        $sort: {
          [sort_by as string]: sort_order,
        },
      });

      // Sort dish by type of dish
      let type = String(req.query._type);
      const typeDish = await TypeDish.findOne({ typeDishName: type });
      if (typeDish) {
        aggregate_options.push({
          $match: {
            typeDishId: typeDish._id,
          },
        });
      }

      // Pagination
      let _page = req.query._page ? +req.query._page : 1;
      let _limit = req.query._limit ? +req.query._limit : 10;
      let _totalRows = await Dish.countDocuments();
      aggregate_options.push({ $skip: (_page - 1) * _limit }, { $limit: _limit });

      //Set up the aggregation
      let data = await Dish.aggregate(aggregate_options);

      Result.success(res, { data, pagination: { _page, _limit, _totalRows } });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  uploadImage: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return Result.error(res, { message: 'File is empty' }, 401);
      }
      if (
        req.file.mimetype === 'image/jpg' ||
        req.file.mimetype === 'image/jpeg' ||
        req.file.mimetype === 'image/png'
      ) {
        const uploader = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
        fs.unlinkSync(req.file.path);
        Result.success(res, { data: uploader });
      } else return Result.error(res, { message: 'Type file does not support' }, 401);
    } catch (error: any) {
      return Result.error(res, { message: error });
    }
  },

  createDish: async (req: IReqAuth, res: Response) => {
    try {
      const { dishName } = req.body;
      const dish = await Dish.findOne({ dishName });
      if (dish) return Result.error(res, { message: 'Dish already exists!' });
      console.log(req.file);

      const newDish = new Dish(req.body);

      await newDish.save();

      Result.success(res, { message: 'create success!' });
    } catch (error: any) {
      return Result.error(res, { message: error });
    }
  },

  deleteDish: async (req: Request, res: Response) => {
    try {
      const dish = await Dish.findOneAndDelete({ _id: req.params.id });
      if (!dish) return Result.error(res, { message: 'Dish does not exists!' });
      Result.success(res, { message: 'Delete Success!' });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },
};

export default dishController;
