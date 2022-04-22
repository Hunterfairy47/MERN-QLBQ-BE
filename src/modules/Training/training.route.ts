import express from 'express';
import trainingController from './training.controller';

const TrainingRouter = express.Router();

TrainingRouter.route('/training').get(trainingController.getTraining).post(trainingController.createTraining);

export default TrainingRouter;
