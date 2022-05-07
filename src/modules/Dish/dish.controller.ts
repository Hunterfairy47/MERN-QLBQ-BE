import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import readXlsxFile from 'read-excel-file/node';
import { IDish, IDishDetails, IIngredientDish, IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import DishDetail from '../DishDetail/dishDetail.model';
import dishDetailService from '../DishDetail/dishDetail.service';
import Ingredients from '../Ingredient/ingredient.model';
import IngredientDish from '../IngredientDish/ingredientDish.model';
import ingredientDishService from '../IngredientDish/ingredientDish.service';
import Training from '../Training/training.model';
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

      aggregate_options.push(
        {
          $lookup: {
            from: 'dishdetails',
            localField: '_id',
            foreignField: 'dishId',
            as: 'dishdetail',
          },
        },
        {
          $unwind: '$dishdetail',
        },

        {
          $lookup: {
            from: 'trainings',
            localField: 'dishdetail.trainingLevelId',
            foreignField: '_id',
            as: 'trainingLevel',
          },
        },
        {
          $unwind: '$trainingLevel',
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

      // Sort dish by training level
      let training = String(req.query._training);
      const trainingLevel = await Training.findOne({ trainingName: training });
      if (trainingLevel) {
        aggregate_options.push({
          $match: {
            'trainingLevel._id': trainingLevel._id,
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

  getOne: async (req: Request, res: Response) => {
    try {
      const data = await Dish.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.params.id),
          },
        },

        // Find type Dish
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
        },

        // Find training level
        {
          $lookup: {
            from: 'dishdetails',
            localField: '_id',
            foreignField: 'dishId',
            as: 'dishdetail',
          },
        },
        {
          $unwind: '$dishdetail',
        },

        {
          $lookup: {
            from: 'trainings',
            localField: 'dishdetail.trainingLevelId',
            foreignField: '_id',
            as: 'trainingLevel',
          },
        },
        {
          $unwind: '$trainingLevel',
        },

        {
          $lookup: {
            from: 'ingredientdishes',
            localField: 'dishdetail._id',
            foreignField: 'dishDetailId',
            as: 'ingredients',
          },
        },
        {
          $unwind: '$ingredients',
        },

        {
          $lookup: {
            from: 'ingredients',
            localField: 'ingredients.ingredientId',
            foreignField: '_id',
            as: 'ingredients.ingredient',
          },
        },
        {
          $unwind: '$ingredients.ingredient',
        },

        {
          $group: {
            _id: '$_id',
            imgUrl: { $first: '$imgUrl' },
            dishName: { $first: '$dishName' },
            englishName: { $first: '$englishName' },
            typeDishes: { $first: '$typeDishes' },
            trainingLevel: { $first: '$trainingLevel' },
            ingredients: {
              $push: {
                _id: '$ingredients.ingredientId',
                realUnit: '$ingredients.realUnit',
                realMass: '$ingredients.realMass',
                standardMass: '$ingredients.ingredient.standardMass',
                ingredientName: '$ingredients.ingredient.ingredientName',
                nutritionDetail: '$ingredients.ingredient.nutritionDetail',
              },
            },
          },
        },
        // {
        //   $project: {
        //     typeDishes: 1,
        //   },
        // },
      ]);
      Result.success(res, { data: data[0] });
    } catch (error) {}
  },

  getAllIngredientDish: async (req: Request, res: Response) => {
    try {
      const dishDetail = await DishDetail.findOne({
        dishId: req.body.dishId,
        trainningLevelId: req.body.trainningLevelId,
      });
      if (dishDetail === null) return;
      const dishDetailId = dishDetail._id;
      const data = await IngredientDish.aggregate([
        {
          $match: {
            dishDetailId: mongoose.Types.ObjectId(dishDetailId),
          },
        },
        {
          $lookup: {
            from: 'ingredients',
            localField: 'ingredientId',
            foreignField: '_id',
            as: 'ingredient',
          },
        },
        {
          $unwind: '$ingredient',
        },
        {
          $addFields: {
            ingredientName: '$ingredient.ingredientName',
            nutritionDetail: '$ingredient.nutritionDetail',
          },
        },
        {
          $project: {
            _id: 1,
            realUnit: 1,
            realMass: 1,
            ingredientId: 1,
            ingredientName: 1,
            nutritionDetail: 1,
          },
        },
      ]);
      Result.success(res, { data });
    } catch (error) {}
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
      console.log(req.body);

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

        await ingredientDishService.create(dataIngredientDish);
      }

      Result.success(res, { message: 'create success!' });
    } catch (error: any) {
      return Result.error(res, { message: error });
    }
  },

  updateIngredientDish: async (req: Request, res: Response) => {
    try {
      const ingredientChangeId = mongoose.Types.ObjectId(req.body.ingredientChange);
      const dishDetail = await DishDetail.findOne({ dishId: req.body.dishId });
      if (dishDetail === null) return;
      const dishDetailId = dishDetail._id;
      const ingredientChange = await IngredientDish.findOneAndUpdate(
        { dishDetailId, ingredientId: req.body.ingredientChanged },
        { $set: { ingredientId: ingredientChangeId } }
      );
      const data = await IngredientDish.aggregate([
        {
          $match: {
            dishDetailId: mongoose.Types.ObjectId(dishDetailId),
          },
        },
        {
          $lookup: {
            from: 'ingredients',
            localField: 'ingredientId',
            foreignField: '_id',
            as: 'ingredient',
          },
        },
        {
          $unwind: '$ingredient',
        },
        {
          $addFields: {
            ingredientName: '$ingredient.ingredientName',
            nutritionDetail: '$ingredient.nutritionDetail',
          },
        },
        {
          $project: {
            _id: 1,
            realUnit: 1,
            realMass: 1,
            ingredientId: 1,
            ingredientName: 1,
            nutritionDetail: 1,
          },
        },
      ]);
      Result.success(res, { data });
    } catch (error) {}
  },

  updateDish: async (req: Request, res: Response) => {
    try {
      const dish = await Dish.findOneAndUpdate({ _id: req.params.id }, req.body);

      if (!dish) return Result.error(res, { message: 'Dish does not exists!' });
      Result.success(res, { message: 'Update Success!' });
    } catch (error) {
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
  uploadDish: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check choosen file
      if (req.file === undefined) {
        return Result.error(res, { message: 'Please up load an excel file!' });
      }

      let excelFile = path.resolve(__dirname, '../../resources/static/ingredients/uploads/' + req.file.filename);

      readXlsxFile(excelFile).then(async (rows) => {
        // skip header
        rows.shift();
        rows.shift();
        rows.shift();

        let dishInValid: IDish[] = [];
        const typeDishCheck = await TypeDish.find();

        rows.forEach(async (row, i) => {
          let typeDishName = String(row[3]);
          let typeDishId = '';
          for (let i = 0; i < typeDishCheck.length; i++) {
            if (typeDishName === typeDishCheck[i].typeDishName) {
              typeDishId = typeDishCheck[i]._id;
            }
          }
          let dish = new Dish({
            dishName: row[1],
            englishName: row[2],
            typeDishId,
          });
          // Check exits dish
          let checkDishExist = await Dish.findOne({ dishName: dish.dishName });
          let newDish: IDish = {
            _id: '',
            dishName: '',
            englishName: '',
            imgUrl: '',
            typeDishId: '',
          };
          if (checkDishExist) {
            dishInValid.push(dish);
          } else {
            // Create new Dish
            newDish = await Dish.create(dish);
          }

          // Create DishDetail by newDish
          let dishId = newDish._id.toString();
          const trainingName = row[4].toString();
          const training = await Training.findOne({ trainingName });
          let trainingLevelId = '';
          if (training) {
            trainingLevelId = training._id.toString();
          }
          const dataDishDetail = { trainingLevelId, dishId } as IDishDetails;
          const dishDetail = await dishDetailService.create(dataDishDetail);

          // Create Ingredient of Dish by dishDetail
          let dishDetailId = dishDetail._id.toString();
          let ingredientNameArr = row[5].toString().split(',');
          let realUnits = row[6].toString().split(',');
          let realMasses = row[7].toString().split(',');

          for (let index = 0; index < ingredientNameArr.length; index++) {
            let ingredientId = '';
            let realUnit = '';
            let realMass = 0;
            const ingredientName = await Ingredients.findOne({ ingredientName: ingredientNameArr[index].trim() });

            if (ingredientName) {
              ingredientId = ingredientName._id;
            }

            for (let k = 0; k < realUnits.length; k++) {
              if (index === k) {
                realUnit = realUnits[k].trim();
              }
            }

            for (let l = 0; l < realMasses.length; l++) {
              if (index === l) {
                realMass = Number(realMasses[l].trim());
              }
            }
            let ingredientObj: IIngredientDish = {
              dishDetailId,
              ingredientId,
              realUnit,
              realMass,
            };
            await ingredientDishService.create(ingredientObj);
          }
        });
      });

      Result.success(res, { message: 'Upload successfully!' });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },
};

export default dishController;
