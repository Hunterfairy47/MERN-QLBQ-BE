import { IDishDetails } from '../../config/interface';
import Dish from './dish.model';

const getOne = async (data: IDishDetails) => {
  try {
    const newDishDetail = await Dish.find(data);
    return newDishDetail;
  } catch (error) {
    throw error;
  }
};

const dishService = { getOne };

export default dishService;
