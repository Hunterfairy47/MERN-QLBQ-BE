import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import mongoose from 'mongoose';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import IngredientDish from '../IngredientDish/ingredientDish.model';
import MenuDetail from '../MenuDetail/menuDetail.model';
import menuDetailService from '../MenuDetail/menuDetail.service';
import Menu from './menu.model';
import menuService from './menu.service';
const ObjectId = mongoose.Types.ObjectId;

const menuController = {
  getAll: async (req: Request, res: Response) => {
    try {
      let aggregate_options = [];
      let search = !!req.query._q;
      let match_regex = { $regex: req.query._q, $options: 'i' };
      aggregate_options.push(
        {
          $lookup: {
            from: 'trainings',
            localField: 'trainingLevelId',
            foreignField: '_id',
            as: 'trainingLevel',
          },
        },
        {
          $unwind: '$trainingLevel',
        }
      );

      // Pagination
      let _page = req.query._page ? +req.query._page : 1;
      let _limit = req.query._limit ? +req.query._limit : 10;
      let _totalRows = await Menu.countDocuments();
      aggregate_options.push({ $skip: (_page - 1) * _limit }, { $limit: _limit });

      //Set up the aggregation
      let data = await Menu.aggregate(aggregate_options);

      Result.success(res, { data, pagination: { _page, _limit, _totalRows } });
    } catch (error) {}
  },

  getMenuDetailDate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = req.params.date;
      const menuId = ObjectId(req.params.menuid);
      const data = await MenuDetail.aggregate([
        {
          $match: { date, menuId },
        },

        {
          $lookup: {
            from: 'menus',
            let: { menuDetail_menuId: '$menuId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$menuDetail_menuId'] },
                },
              },

              {
                $lookup: {
                  from: 'trainings',
                  let: { trainingId: '$trainingLevelId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$trainingId'] },
                      },
                    },
                  ],
                  as: 'training',
                },
              },
              {
                $unwind: '$training',
              },
            ],
            as: 'menu',
          },
        },

        {
          $unwind: '$menu',
        },

        {
          $lookup: {
            from: 'dishes',
            let: { menuDetail_dishId: '$dishId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$menuDetail_dishId'] },
                },
              },
              {
                $lookup: {
                  from: 'typedishes',
                  let: { typeDishId: '$typeDishId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$typeDishId'] },
                      },
                    },
                  ],
                  as: 'typedish',
                },
              },
              {
                $unwind: '$typedish',
              },
            ],
            as: 'dish',
          },
        },
        {
          $unwind: '$dish',
        },

        {
          $lookup: {
            from: 'dishdetails',
            localField: 'dish._id',
            foreignField: 'dishId',
            let: { menu_trainingLevelId: '$menu.trainingLevelId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$trainingLevelId', '$$menu_trainingLevelId'] },
                },
              },
            ],
            as: 'dish.dishdetail',
          },
        },
        {
          $unwind: '$dish.dishdetail',
        },

        {
          $lookup: {
            from: 'ingredientdishes',
            let: { dishdetailId: '$dish.dishdetail._id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$dishDetailId', '$$dishdetailId'] },
                },
              },

              {
                $lookup: {
                  from: 'ingredients',
                  let: { ingredientId: '$ingredientId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$ingredientId'] },
                      },
                    },
                  ],
                  as: 'ingredient',
                },
              },
              {
                $unwind: '$ingredient',
              },
            ],
            as: 'dish.ingredientdish',
          },
        },

        {
          $group: {
            _id: null,
            menuId: { $first: '$menuId' },
            date: { $first: '$date' },
            trainingLevelName: { $first: '$menu.training.trainingName' },
            menuDetail: {
              $push: {
                dishId: '$dish._id',
                dishName: '$dish.dishName',
                typeDishName: '$dish.typedish.typeDishName',
                dishDetailId: '$dish.dishdetail._id',
                ingredientdish: '$dish.ingredientdish',
              },
            },
          },
        },
      ]);

      Result.success(res, { data: data[0] });
    } catch (error) {
      next(error);
    }
  },

  updateMenuDetailDate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const menuDetail = req.body.menuDetail;
      menuDetail.forEach((e: any) => {
        const dishDetailId = e.dishDetailId;
        e.ingredientdish.forEach(async (item: any) => {
          const ingredientId = item.ingredientId;
          await IngredientDish.findOneAndUpdate({ dishDetailId, ingredientId }, item);
        });
      });

      Result.success(res, { message: 'Save success!' });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req: Request, res: Response) => {
    try {
      const data = await Menu.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },

        {
          $lookup: {
            from: 'trainings',
            localField: 'trainingLevelId',
            foreignField: '_id',
            as: 'trainingLevel',
          },
        },
        {
          $unwind: '$trainingLevel',
        },

        {
          $lookup: {
            from: 'menudetails',
            localField: '_id',
            foreignField: 'menuId',
            as: 'menuDetails',
          },
        },
        {
          $unwind: { path: '$menuDetails', preserveNullAndEmptyArrays: true },
        },

        {
          $lookup: {
            from: 'dishes',
            localField: 'menuDetails.dishId',
            foreignField: '_id',
            as: 'menuDetails.dish',
          },
        },
        {
          $unwind: { path: '$menuDetails.dish', preserveNullAndEmptyArrays: true },
        },

        {
          $group: {
            _id: null,
            menuId: { $first: '$_id' },
            startDate: { $first: '$startDate' },
            endDate: { $first: '$endDate' },
            trainingLevelName: { $first: '$trainingLevel.trainingName' },
            menuDetail: {
              $push: {
                date: '$menuDetails.date',
                dishes: {
                  _id: '$menuDetails.dish._id',
                  dishName: '$menuDetails.dish.dishName',
                },
              },
            },
          },
        },
      ]);

      Result.success(res, { data: data[0] });
    } catch (error) {}
  },

  getOneByDate: async (req: Request, res: Response) => {
    try {
      const startDate = req.body.startDate;

      const trainingLevelId = req.body.trainingLevelId;
      const menuId = await Menu.findOne({
        startDate,
        trainingLevelId,
      });

      const data = await Menu.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(menuId?._id),
          },
        },

        {
          $lookup: {
            from: 'trainings',
            localField: 'trainingLevelId',
            foreignField: '_id',
            as: 'trainingLevel',
          },
        },
        {
          $unwind: '$trainingLevel',
        },

        {
          $lookup: {
            from: 'menudetails',
            localField: '_id',
            foreignField: 'menuId',
            as: 'menuDetails',
          },
        },
        {
          $unwind: { path: '$menuDetails', preserveNullAndEmptyArrays: true },
        },

        {
          $lookup: {
            from: 'dishes',
            localField: 'menuDetails.dishId',
            foreignField: '_id',
            as: 'menuDetails.dish',
          },
        },
        {
          $unwind: { path: '$menuDetails.dish', preserveNullAndEmptyArrays: true },
        },

        {
          $group: {
            _id: null,
            menuId: { $first: '$_id' },
            startDate: { $first: '$startDate' },
            endDate: { $first: '$endDate' },
            trainingLevelName: { $first: '$trainingLevel.trainingName' },
            menuDetail: {
              $push: {
                date: '$menuDetails.date',
                dishes: {
                  _id: '$menuDetails.dish._id',
                  dishName: '$menuDetails.dish.dishName',
                  englishName: '$menuDetails.dish.englishName',
                },
              },
            },
          },
        },
      ]);

      Result.success(res, { data: data[0] });
    } catch (error) {}
  },

  createMenu: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { menuName, startDate, endDate, trainingLevelId, baseId } = req.body;
      const menus = await Menu.findOne({ menuName });
      if (menus) return Result.error(res, { message: 'Menu already exists!' });
      const newStartDate = moment(startDate).format('DD/MM/YYYY');
      const newEndDate = moment(endDate).format('DD/MM/YYYY');

      const newMenu = new Menu({ menuName, startDate: newStartDate, endDate: newEndDate, trainingLevelId, baseId });
      const data = await newMenu.save();
      Result.success(res, { data, message: 'Create success!' });
    } catch (error: any) {
      next(error);
    }
  },

  createMenuDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await menuDetailService.createMenuDetail(req.body);
      Result.success(res, { data });
    } catch (error: any) {
      next(error);
    }
  },

  updateMenuDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await menuDetailService.updateMenuDetail(req.body);
      Result.success(res, { data });
    } catch (error: any) {
      next(error);
    }
  },

  exportMenuDetailDate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await menuService.exportExcel(req.body);
    } catch (error: any) {
      next(error);
    }
  },
};

export default menuController;
