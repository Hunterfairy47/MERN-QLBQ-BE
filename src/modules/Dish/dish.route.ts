import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import dishController from './dish.controller';

const DishRouter = express.Router();

DishRouter.route('/dish').get(dishController.getDish);
DishRouter.route('/dish/create').post(auth, authorize('admin'), dishController.createDish);

export default DishRouter;
