import { Request, Response } from 'express';
import TypeDish from './typeDish.model';

const typeDishController = {
  getTypeDish: async (req: Request, res: Response) => {
    try {
      const typeDishs = await TypeDish.find();
      res.json({ msg: 'get success!', typeDishs });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createTypeDish: async (req: Request, res: Response) => {
    try {
      const { typeDishName } = req.body;
      const typeDish = await TypeDish.findOne({ typeDishName });
      if (typeDish) return res.status(400).json({ msg: 'Type of dish already exists!' });

      const newtypeDish = new TypeDish(req.body);
      await newtypeDish.save();
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

export default typeDishController;
