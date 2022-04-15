import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { uploadFile } from '../../middleware/upload.middleware';
import ingredientController from './ingredient.controller';

const IngredientRouter = express.Router();

IngredientRouter.route('/ingredient')
  .get(ingredientController.getIngredient)
  .post(ingredientController.createIngredient);
IngredientRouter.route('/ingredient/:id')
  .patch(ingredientController.updateIngredient)
  .delete(auth, authorize('admin'), ingredientController.deleteIngredient);

IngredientRouter.route('/ingredient/upload').post(uploadFile, ingredientController.uploadIngredient);

export default IngredientRouter;
