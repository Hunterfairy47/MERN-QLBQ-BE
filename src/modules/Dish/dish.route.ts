import express from 'express';
import { uploadImage } from '../../middleware/image.middleware';
import dishController from './dish.controller';

const DishRouter = express.Router();

DishRouter.route('/dish').get(dishController.getDish).post(uploadImage, dishController.createDish);
DishRouter.route('/upload').post(uploadImage, dishController.uploadImage);
DishRouter.route('/dish/change/:id').patch(dishController.updateIngredientDish);
DishRouter.route('/dish/getall').post(dishController.getAllIngredientDish);
DishRouter.route('/dish/:id').get(dishController.getOne).delete(dishController.deleteDish);

export default DishRouter;
