import { IIngredientDish } from '../../config/interface';
import IngredientDish from './ingredientDish.model';

const create = async (data: IIngredientDish) => {
  try {
    const newDishDetail = await IngredientDish.create(data);
    return newDishDetail;
  } catch (error) {
    throw error;
  }
};

const ingredientDishService = { create };

export default ingredientDishService;
