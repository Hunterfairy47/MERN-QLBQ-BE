import express from 'express';
import trainingController from './training.controller';

const TrainingRouter = express.Router();

TrainingRouter.route('/trainings').get(trainingController.getTrainings).post(trainingController.createTraining);
TrainingRouter.route('/trainings/:id')
  .delete(trainingController.deleteTraining)
  .patch(trainingController.updateTraining);

export default TrainingRouter;
