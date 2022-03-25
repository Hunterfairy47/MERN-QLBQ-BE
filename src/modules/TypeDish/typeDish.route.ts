import express from 'express';
import typeDishController from './typeDish.controller';

const TypeDishRouter = express.Router();

TypeDishRouter.route('/typedish').get(typeDishController.getTypeDish);
TypeDishRouter.route('/typedish/create').post(typeDishController.createTypeDish);

export default TypeDishRouter;
