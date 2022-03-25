import { NextFunction, Request, Response } from 'express';
import { IReqAuth } from '../../config/interface';
import Training from './training.model';

const trainingController = {
  getTraining: async (req: Request, res: Response) => {
    try {
      const trainings = await Training.find();
      res.json({ msg: 'get success!', trainings });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  createTraining: async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
      const { trainingName } = req.body;
      const trainingLevel = await Training.findOne({ trainingName });
      if (trainingLevel) return res.status(400).json({ msg: 'Training Level already exists!' });

      const newTrainingLevel = new Training(req.body);
      await newTrainingLevel.save();
      res.json({ msg: 'create success!' });
    } catch (error: any) {
      next(error);
    }
  },
};

export default trainingController;
