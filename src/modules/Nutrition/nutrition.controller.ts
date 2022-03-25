import { Request, Response } from 'express';
import Nutritions from './nutrition.model';

const nutritionController = {
  getNutritions: async (req: Request, res: Response) => {
    try {
      const nutritions = await Nutritions.find();
      res.json({ msg: 'get success!', nutritions });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createNutrition: async (req: Request, res: Response) => {
    try {
      const { nutritionName } = req.body;
      const nutrition = await Nutritions.findOne({ nutritionName });
      if (nutrition) return res.status(400).json({ msg: 'Nutrition already exists!' });

      const newNutrition = new Nutritions(req.body);
      await newNutrition.save();
      res.json({ msg: 'create success!' });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exits.';
      }
      return res.status(500).json({ msg: errMsg });
    }
  },
};

export default nutritionController;
