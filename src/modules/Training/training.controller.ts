import { NextFunction, Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Result from '../../utils/result';
import Training from './training.model';
import trainingService from './training.service';

const trainingController = {
  getTrainings: async (req: Request, res: Response) => {
    try {
      const { newTrainings, pagination } = await trainingService.getAll(req.query);
      Result.success(res, { data: newTrainings, pagination });
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

  updateTraining: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainingId = req.params.id;
      await trainingService.update(trainingId, req.body);
      Result.success(res, { message: 'Update Success!' });
    } catch (err: any) {
      return next(err);
    }
  },

  deleteTraining: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainingId = req.params.id;
      await trainingService.deleteOne(trainingId);
      Result.success(res, { message: 'Delete Success!' });
    } catch (err: any) {
      return next(err);
    }
  },
};

export default trainingController;
