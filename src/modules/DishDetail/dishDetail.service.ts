import { IDishDetails } from '../../config/interface';
import DishDetail from './dishDetail.model';

const create = async (data: IDishDetails) => {
  try {
    const newDishDetail = await DishDetail.create(data);
    return newDishDetail;
  } catch (error) {
    throw error;
  }
};

const dishDetailService = { create };

export default dishDetailService;
