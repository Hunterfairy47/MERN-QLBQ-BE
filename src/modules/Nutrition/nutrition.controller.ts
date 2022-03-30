import { Request, Response } from 'express';
import Result from '../../utils/result';
import Nutritions from './nutrition.model';

const nutritionController = {
  // Get all nutrition
  getNutritions: async (req: Request, res: Response) => {
    try {
      const nutritions = await Nutritions.find();
      Result.success(res, nutritions);
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  // Get Nutrition active
  getNutritionActive: async (req: Request, res: Response) => {
    try {
      const nutritionActive = await Nutritions.find({ active: true }).sort({ createdAt: 1 });
      Result.success(res, nutritionActive);
    } catch (error) {
      Result.error(res, { message: error });
    }
  },

  createNutrition: async (req: Request, res: Response) => {
    try {
      const { nutritionName } = req.body;
      const nutrition = await Nutritions.findOne({ nutritionName });
      if (nutrition) return Result.error(res, { message: 'Nutrition already exists!' });
      const newNutrition = new Nutritions(req.body);
      await newNutrition.save();

      Result.success(res, { message: 'create success!' });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exits.';
      }
      Result.error(res, { message: errMsg });
    }
  },
};

export default nutritionController;
