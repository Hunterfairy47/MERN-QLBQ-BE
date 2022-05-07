import { NextFunction, Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import Training from './training.model';

const trainingController = {
  getTraining: async (req: Request, res: Response) => {
    try {
      const data = await Training.find();
      Result.success(res, { data });
    } catch (error) {
      return Result.error(res, { message: error });
    }
  },

  createTraining: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { trainingName } = req.body;
      const trainingLevel = await Training.findOne({ trainingName });
      if (trainingLevel) return Result.error(res, { message: 'Training Level already exists!' });
      const newTrainingLevel = new Training(req.body);
      await newTrainingLevel.save();

      Result.success(res, { message: 'Create success!' });
    } catch (error: any) {
      next(error);
    }
  },
};

export default trainingController;
