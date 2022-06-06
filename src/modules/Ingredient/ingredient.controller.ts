import { NextFunction, Request, Response } from 'express';
import path from 'path';
import readXlsxFile from 'read-excel-file/node';
import { Ingredient } from '../../config/interface';
import Result from '../../utils/result';
import ingredientDishModel from '../IngredientDish/ingredientDish.model';
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

      if (nutrition && _sign && _value) {
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
      }

      //Set up the aggregation
      let data = await Ingredients.aggregate(aggregate_options);

      Result.success(res, { data, pagination: { _page, _limit, _totalRows } });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const data = await Ingredients.find();
      Result.success(res, { data });
    } catch (error) {}
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
      const dish = await ingredientDishModel.findOne({ ingredientId: req.params.id });
      if (dish)
        return Result.error(res, { message: 'Không thể xoá. Nguyên liệu này hiện đang được sử dụng trong món ăn.' });
      const ingredient = await Ingredients.findOneAndDelete({ _id: req.params.id });
      if (!ingredient) return Result.error(res, { message: 'Ingredient does not exists!' });
      Result.success(res, { message: 'Delete Success!' });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  uploadIngredient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file === undefined) {
        return Result.error(res, { message: 'Please up load an excel file!' });
      }

      let excelFile = path.resolve(__dirname, '../../resources/static/ingredients/uploads/' + req.file.filename);

      readXlsxFile(excelFile).then(async (rows) => {
        // skip header
        rows.shift();
        rows.shift();

        //
        const nutritions = await Nutritions.find();
        let nutritionDetail: any = [];
        rows.forEach((row) => {
          let nutritionFromFile = {
            Calo: row[3],
            Béo: row[4],
            Đường: row[5],
            Đạm: row[6],
          };

          for (let [key, value] of Object.entries(nutritionFromFile)) {
            nutritions.map((nutrition) => {
              if (nutrition.nutritionName === key) {
                key = nutrition._id;
              }
            });
            const item = {
              ingredient: row[1],
              nutritionId: key,
              nutritionValue: value,
            };
            console.log(item);

            nutritionDetail.push(item);
          }
        });
        let ingredients: Ingredient[] = [];
        rows.forEach(async (row) => {
          let nutritionArr: any = [];
          nutritionDetail.map((item: any) => {
            if (item.ingredient === row[1]) {
              let itemArr = {
                nutritionId: item.nutritionId,
                nutritionValue: item.nutritionValue,
              };
              nutritionArr.push(itemArr);
            }
          });
          let ingredient = new Ingredients({
            ingredientName: row[1],
            standardMass: row[2],
            nutritionDetail: nutritionArr,
          });
          console.log('row', ingredient);
          ingredients.push(ingredient);
        });

        const ingredientList = await Ingredients.create(ingredients);
        Result.success(res, { message: 'Upload file successfully.', data: ingredientList });
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default ingredientController;
