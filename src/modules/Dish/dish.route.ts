import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { uploadImage } from '../../middleware/image.middleware';
import { uploadFile } from '../../middleware/upload.middleware';
import dishController from './dish.controller';

const DishRouter = express.Router();

DishRouter.route('/dish')
  .get(auth, authorize('admin'), dishController.getDish)
  .post(auth, authorize('admin'), uploadImage, dishController.createDish);
DishRouter.route('/upload').post(auth, authorize('admin'), uploadImage, dishController.uploadImage);
DishRouter.route('/uploadexcel').post(auth, authorize('admin'), uploadFile, dishController.uploadDish);
DishRouter.route('/dish/change/:id').patch(auth, authorize('admin'), dishController.updateIngredientDish);
DishRouter.route('/dish/getall').post(auth, authorize('admin'), dishController.getAllIngredientDish);
DishRouter.route('/dish/:id')
  .get(auth, authorize('admin'), dishController.getOne)
  .delete(auth, authorize('admin'), dishController.deleteDish)
  .patch(auth, authorize('admin'), dishController.updateDish);

export default DishRouter;
