import express from 'express';
import nutritionController from './nutrition.controller';

const NutritionRouter = express.Router();

NutritionRouter.route('/nutrition').get(nutritionController.getNutritions);
NutritionRouter.route('/nutrition/active').get(nutritionController.getNutritionActive);
NutritionRouter.route('/nutrition/create').post(nutritionController.createNutrition);

export default NutritionRouter;
