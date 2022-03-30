import { Request, Response } from 'express';
import Result from '../../utils/result';
import Ingredients from './ingredient.model';

const ingredientController = {
  getIngredient: async (req: Request, res: Response) => {
    try {
      const ingredients = await Ingredients.find();
      Result.success(res, ingredients);
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  createIngredient: async (req: Request, res: Response) => {
    try {
      console.log('Client send: ', req.body);

      const { ingredientName } = req.body;
      console.log('ingredientName', ingredientName);

      const ingredient = await Ingredients.findOne({ ingredientName });
      if (ingredient) return Result.error(res, { message: 'Ingredient already exists!' });
      const newIngredient = await Ingredients.create(req.body);
      console.log('newIngredient', newIngredient);

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
};

export default ingredientController;
