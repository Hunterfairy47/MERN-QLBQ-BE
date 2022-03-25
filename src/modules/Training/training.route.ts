import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import trainingController from './training.controller';

const TrainingRouter = express.Router();

TrainingRouter.route('/training')
  .get(auth, trainingController.getTraining)
  .post(auth, authorize('admin'), trainingController.createTraining);

export default TrainingRouter;
