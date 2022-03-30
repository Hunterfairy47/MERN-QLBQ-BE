import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import ingredientController from './ingredient.controller';

const IngredientRouter = express.Router();

IngredientRouter.route('/ingredient')
  .get(ingredientController.getIngredient)
  .post(auth, authorize('admin'), ingredientController.createIngredient);
IngredientRouter.route('/ingredient/:id').patch(auth, authorize('admin'), ingredientController.updateIngredient);

export default IngredientRouter;
