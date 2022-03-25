import AuthRouter from '../modules/Auth/auth.route';
import BaseRouter from '../modules/Base/base.route';
import DishRouter from '../modules/Dish/dish.route';
import IngredientRouter from '../modules/Ingredient/ingredient.route';
import MenuRouter from '../modules/Menu/menu.route';
import NutritionRouter from '../modules/Nutrition/nutrition.route';
import TrainingRouter from '../modules/Training/training.route';
import TypeDishRouter from '../modules/TypeDish/typeDish.route';

const routes = [
  AuthRouter,
  NutritionRouter,
  IngredientRouter,
  BaseRouter,
  TypeDishRouter,
  DishRouter,
  TrainingRouter,
  MenuRouter,
];

export default routes;
