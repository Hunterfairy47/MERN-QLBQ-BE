import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import mongoose from 'mongoose';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import MenuDetail from '../MenuDetail/menuDetail.model';
import menuDetailService from '../MenuDetail/menuDetail.service';
import Menu from './menu.model';
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
      const date = moment(new Date(req.params.date)).format('DD/MM/YYYY');
      const data = await MenuDetail.aggregate([
        {
          $match: { date },
        },

        {
          $lookup: {
            from: 'dishes',
            localField: 'dishId',
            foreignField: '_id',
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
            as: 'dishDetail',
          },
        },

        {
          $unwind: '$dishDetail',
        },

        // {
        //   $lookup: {
        //     from: 'ingredientdishes',
        //     localField: 'dishDetail._id',
        //     foreignField: 'dishDetailId',
        //     as: 'ingredientdish',
        //   },
        // },

        // {
        //   $unwind: '$ingredientdish',
        // },

        // {
        //   $lookup: {
        //     from: 'ingredients',
        //     localField: 'ingredientdish.ingredientId',
        //     foreignField: '_id',
        //     as: 'ingredient',
        //   },
        // },

        // {
        //   $unwind: '$ingredient',
        // },

        {
          $lookup: {
            from: 'typedishes',
            localField: 'dish.typeDishId',
            foreignField: '_id',
            as: 'typeDish',
          },
        },

        {
          $unwind: '$typeDish',
        },

        {
          $lookup: {
            from: 'menus',
            localField: 'menuId',
            foreignField: '_id',
            as: 'menu',
          },
        },

        {
          $unwind: '$menu',
        },

        {
          $lookup: {
            from: 'trainings',
            localField: 'menu.trainingLevelId',
            foreignField: '_id',
            as: 'trainingLevel',
          },
        },

        {
          $unwind: '$trainingLevel',
        },

        {
          $group: {
            _id: null,
            menuId: { $first: '$menuId' },
            date: { $first: '$date' },
            trainingLevelName: { $first: '$trainingLevel.trainingName' },
            menuDetail: {
              $push: {
                _id: '$dish._id',
                dishName: '$dish.dishName',
                typeDishName: '$typeDish.typeDishName',
              },
            },
            // ingredients: {
            //   $push: {
            //     _id: '$ingredient._id',
            //     ingredientName: '$ingredient.ingredientName',
            //     realUnit: '$ingredientdish.realUnit',
            //     realMass: '$ingredientdish.realMass',
            //   },
            // },
          },
        },
      ]);

      Result.success(res, { data: data[0] });
    } catch (error) {
      next(error);
    }
  },

  // updateMenuDetailsById: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     let list = req.body;
  //     let day = req.params.id;
  //     const date = await MenuDetails.find({ date: day });
  //     for (let i = 0; i < date.length; i++) {
  //       for (let j = 0; j < list.data.length; j++) {
  //         if (list.data[j].dishId === date[i].dishId && day === '2020-03-22T17:00:00.000+00:00') {
  //           await DishDetails.create({
  //             menuDetailsId: date[i]._id,
  //             ...list.data[i],
  //           });
  //         }
  //       }
  //     }
  //     Result.success(res, { message: 'Post success!' });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

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
          $unwind: '$menuDetails',
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
          $unwind: '$menuDetails.dish',
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

  createMenu: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { menuName } = req.body;
      const menus = await Menu.findOne({ menuName });
      if (menus) return Result.error(res, { message: 'Menu already exists!' });
      const newMenu = new Menu(req.body);
      const data = await newMenu.save();
      Result.success(res, { data, message: 'Create success!' });
    } catch (error: any) {
      next(error);
    }
  },

  createMenuDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await menuDetailService.createMenuDetail(req.body);

      console.log(data);

      Result.success(res, { data });
    } catch (error: any) {
      next(error);
    }
  },
};

export default menuController;
