import { Request, Response } from 'express';
import Result from '../../utils/result';
import Dish from '../Dish/dish.model';
import Nutritions from '../Nutrition/nutrition.model';
import Ingredients from './ingredient.model';

const ingredientController = {
  getIngredient: async (req: Request, res: Response) => {
    try {
      let aggregate_options = [];
      let search = !!req.query._q;
      let match_regex = { $regex: req.query._q, $options: 'i' };

      // Search
      if (search) {
        aggregate_options.push({
          $match: {
            $or: [{ ingredientName: match_regex }],
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

      // Pagination
      let _page = req.query._page ? +req.query._page : 1;
      let _limit = req.query._limit ? +req.query._limit : 10;
      let _totalRows = await Ingredients.countDocuments();
      aggregate_options.push({ $skip: (_page - 1) * _limit }, { $limit: _limit });

      // sorting ingredients
      let nutrition = String(req.query._nutrition);
      let _sign = req.query._sign;
      let _value = Number(req.query._value);
      const nutritionName = await Nutritions.findOne({ nutritionName: nutrition });

      if (_sign === 'equal') {
        aggregate_options.push({
          $match: {
            nutritionDetail: {
              $all: [
                {
                  $elemMatch: {
                    nutritionId: nutritionName?._id,
                    nutritionValue: { $eq: _value },
                  },
                },
              ],
            },
          },
        });
      } else if (_sign === 'less') {
        aggregate_options.push({
          $match: {
            nutritionDetail: {
              $all: [
                {
                  $elemMatch: {
                    nutritionId: nutritionName?._id,
                    nutritionValue: { $lt: _value },
                  },
                },
              ],
            },
          },
        });
      } else if (_sign === 'lessThan') {
        aggregate_options.push({
          $match: {
            nutritionDetail: {
              $all: [
                {
                  $elemMatch: {
                    nutritionId: nutritionName?._id,
                    nutritionValue: { $lte: _value },
                  },
                },
              ],
            },
          },
        });
      } else if (_sign === 'more') {
        aggregate_options.push({
          $match: {
            nutritionDetail: {
              $all: [
                {
                  $elemMatch: {
                    nutritionId: nutritionName?._id,
                    nutritionValue: { $gt: _value },
                  },
                },
              ],
            },
          },
        });
      } else if (_sign === 'greaterThan') {
        aggregate_options.push({
          $match: {
            nutritionDetail: {
              $all: [
                {
                  $elemMatch: {
                    nutritionId: nutritionName?._id,
                    nutritionValue: { $gte: _value },
                  },
                },
              ],
            },
          },
        });
      }

      //Set up the aggregation
      let data = await Ingredients.aggregate(aggregate_options);

      Result.success(res, { data, pagination: { _page, _limit, _totalRows } });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  createIngredient: async (req: Request, res: Response) => {
    try {
      const { ingredientName } = req.body;
      // const { nutritionDetail } = req.body;
      // const nutrition = await Nutrition.find();

      // let newNutritionDetail = [...nutritionDetail];
      // nutrition.forEach((item) => {
      //   nutritionDetail.forEach((e: { nutritionId: string; nutritionValue: string }) => {
      //     if (item._id !== e.nutritionId) {
      //       newNutritionDetail.push({ nutritionId: item._id, nutritionValue: '0' });
      //     }
      //   });
      // });
      const ingredient = await Ingredients.findOne({ ingredientName });
      if (ingredient) return Result.error(res, { message: 'Ingredient already exists!' });

      await Ingredients.create(req.body);

      Result.success(res, { message: 'Create success!' });
    } catch (error: any) {
      return Result.error(res, { message: Object.values(error.keyValue)[0] + ' already exits.' });
    }
  },

  updateIngredient: async (req: Request, res: Response) => {
    try {
      const ingredient = await Ingredients.findOneAndUpdate({ _id: req.params.id }, req.body);

      if (!ingredient) return Result.error(res, { message: 'Ingredient does not exists!' });
      Result.success(res, { message: 'Update Success!' });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  deleteIngredient: async (req: Request, res: Response) => {
    try {
      const dish = await Dish.findOne({ ingredients: req.params.id });
      if (dish)
        return Result.error(res, { message: 'Can not delete ingredient. This ingredient is present in the dish.' });

      const ingredient = await Ingredients.findOneAndDelete({ _id: req.params.id });
      if (!ingredient) return Result.error(res, { message: 'Ingredient does not exists!' });
      Result.success(res, { message: 'Delete Success!' });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },
};

export default ingredientController;
