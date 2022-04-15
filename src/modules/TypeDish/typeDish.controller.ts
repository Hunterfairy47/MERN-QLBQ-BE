import { Request, Response } from 'express';
import Result from '../../utils/result';
import TypeDish from './typeDish.model';

const typeDishController = {
  getTypeDish: async (req: Request, res: Response) => {
    try {
      const data = await TypeDish.find();
      Result.success(res, { data });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  createTypeDish: async (req: Request, res: Response) => {
    try {
      const { typeDishName } = req.body;
      const typeDish = await TypeDish.findOne({ typeDishName });
      if (typeDish) return Result.error(res, { message: 'Type of dish already exists!' });

      const newtypeDish = new TypeDish(req.body);
      await newtypeDish.save();

      Result.success(res, { message: 'Create success!' });
    } catch (error: any) {
      let errMsg;
      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exits.';
      }
      return Result.error(res, { message: errMsg });
    }
  },
};

export default typeDishController;
