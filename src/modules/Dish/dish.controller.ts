import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import { IDishDetails, IIngredientDish, IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import DishDetail from '../DishDetail/dishDetail.model';
import dishDetailService from '../DishDetail/dishDetail.service';
import IngredientDish from '../IngredientDish/ingredientDish.model';
import ingredientDishService from '../IngredientDish/ingredientDish.service';
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
      const { dishName, trainingLevelId, ingredients } = req.body;
      const dish = await Dish.findOne({ dishName });
      if (dish) return Result.error(res, { message: 'Dish already exists!' });

      // Create new Dish
      const newDish = await Dish.create(req.body);

      // Create new DishDetail
      const dishId = newDish._id;
      const dataDishDetail = { trainingLevelId, dishId } as IDishDetails;
      const dishDetail = await dishDetailService.create(dataDishDetail);

      // Create Ingredient_Dish
      const dishDetailId = dishDetail._id;
      for (let i = 0; i < ingredients.length; i++) {
        let realUnit = ingredients[i].realUnit;
        let realMass = ingredients[i].realMass;
        let ingredientId = ingredients[i].ingredientId;

        const dataIngredientDish = { dishDetailId, realUnit, realMass, ingredientId } as IIngredientDish;
        console.log(dataIngredientDish);

        await ingredientDishService.create(dataIngredientDish);
      }

      Result.success(res, { message: 'create success!' });
    } catch (error: any) {
      return Result.error(res, { message: error });
    }
  },

  deleteDish: async (req: Request, res: Response) => {
    try {
      // Delete img on clound
      const dishImg = await Dish.findOne({ _id: req.params.id });
      const url = dishImg?.imgUrl;
      const imgUrl = url?.substring(url?.lastIndexOf('/') + 1).split('.')[0] as string;
      await cloudinary.uploader.destroy(imgUrl);
      const dishDetailId = await DishDetail.findOne({ dishId: req.params.id });

      // Delete IngredientDish
      const dishDetail = await IngredientDish.find({ dishDetailId: dishDetailId?._id });
      for (let i = 0; i < dishDetail.length; i++) {
        await IngredientDish.findOneAndDelete({ _id: dishDetail[i]._id });
      }

      // Delete DishDetail
      await DishDetail.findOneAndDelete({ dishId: req.params.id });

      // Delete Dish
      const dish = await Dish.findOneAndDelete({ _id: req.params.id });
      if (!dish) return Result.error(res, { message: 'Dish does not exists!' });
      Result.success(res, { message: 'Delete Success!' });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },
};

export default dishController;
