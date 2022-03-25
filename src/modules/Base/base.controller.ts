import { NextFunction, Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Base from './base.model';

const baseController = {
  getBase: async (req: Request, res: Response) => {
    try {
      const bases = await Base.find();
      res.json({ msg: 'get success!', bases });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createBase: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { baseName } = req.body;
      const ingredient = await Base.findOne({ baseName });
      if (ingredient) return res.status(400).json({ msg: 'Base already exists!' });

      const newBase = new Base(req.body);
      await newBase.save();
      res.json({ msg: 'create success!' });
    } catch (error: any) {
      next(error);
    }
  },

  updateBase: async (req: IReqAuth, res: Response) => {
    try {
      const base = await Base.findOneAndUpdate({ _id: req.params.id }, req.body);

      if (!base) return res.status(400).json({ msg: 'Base does not exists!' });
      res.json({ msg: 'Update Success!' });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteBase: async (req: IReqAuth, res: Response) => {
    try {
      const base = await Base.findOneAndDelete({ _id: req.params.id });

      if (!base) return res.status(400).json({ msg: 'Base does not exists!' });
      res.json({ msg: 'Delete Success!' });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default baseController;