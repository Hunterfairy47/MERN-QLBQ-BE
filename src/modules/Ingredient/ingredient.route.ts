import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { uploadFile } from '../../middleware/upload.middleware';
import ingredientController from './ingredient.controller';

const IngredientRouter = express.Router();

IngredientRouter.route('/ingredient')
  .get(auth, authorize('admin'), ingredientController.getIngredient)
  .post(auth, authorize('admin'), ingredientController.createIngredient);
IngredientRouter.route('/ingredient/:id')
  .patch(auth, authorize('admin'), ingredientController.updateIngredient)
  .delete(auth, authorize('admin'), ingredientController.deleteIngredient);

IngredientRouter.route('/ingredient/upload').post(
  auth,
  authorize('admin'),
  uploadFile,
  ingredientController.uploadIngredient
);

IngredientRouter.route('/ingredient/getall').get(auth, authorize('admin'), ingredientController.getAll);

export default IngredientRouter;
