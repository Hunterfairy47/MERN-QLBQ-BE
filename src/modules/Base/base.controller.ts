import { NextFunction, Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import Base from './base.model';
import baseService from './base.service';

const baseController = {
  getBases: async (req: Request, res: Response) => {
    try {
      const { bases, pagination } = await baseService.getAll(req.query);
      Result.success(res, { data: bases, pagination });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  createBase: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { baseName } = req.body;
      const ingredient = await Base.findOne({ baseName });
      if (ingredient) return Result.error(res, { message: 'Base already exists!' });

      const newBase = new Base(req.body);
      await newBase.save();
      Result.success(res, { message: 'Create Success!' });
    } catch (error: any) {
      next(error);
    }
  },

  updateBase: async (req: IReqAuth, res: Response) => {
    try {
      const baseId = req.params.id;
      await baseService.update(baseId, req.body);
      Result.success(res, { message: 'Update Success!' });
    } catch (error: any) {
      return Result.error(res, { message: error.message });
    }
  },

  deleteBase: async (req: IReqAuth, res: Response) => {
    try {
      const baseId = req.params.id;
      await baseService.deleteOne(baseId);
      Result.success(res, { message: 'Delete Success!' });
    } catch (error: any) {
      return Result.error(res, { message: error.message });
    }
  },
};

export default baseController;
