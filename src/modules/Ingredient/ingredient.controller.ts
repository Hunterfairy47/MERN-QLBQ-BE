import { Request, Response } from 'express';
import Ingredients from './ingredient.model';

const ingredientController = {
  getIngredient: async (req: Request, res: Response) => {
    try {
      const ingredients = await Ingredients.find();
      res.json({ msg: 'get success!', ingredients });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createIngredient: async (req: Request, res: Response) => {
    try {
      const { ingredientName } = req.body;
      console.log(req.body);
      const ingredient = await Ingredients.findOne({ ingredientName });
      if (ingredient) return res.status(400).json({ msg: 'Ingredient already exists!' });

      const newIngredient = new Ingredients(req.body);
      await newIngredient.save();
      res.json({ msg: 'create success!' });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exits.';
      }
      return res.status(500).json({ msg: errMsg });
    }
  },

  updateIngredient: async (req: Request, res: Response) => {
    try {
      const ingredient = await Ingredients.findOneAndUpdate({ _id: req.params.id }, req.body);

      if (!ingredient) return res.status(400).json({ msg: 'Ingredient does not exists!' });
      res.json({ msg: 'Update Success!' });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default ingredientController;
