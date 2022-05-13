import { IMenuDetailProps } from '../../config/interface';
import MenuDetail from './menuDetail.model';

const createMenuDetail = (data: IMenuDetailProps) => {
  try {
    const menuId = data.menuId;
    data.menuDetail.forEach((e) => {
      e.dish.map(async (item) => {
        if (item !== null) {
          const newMenuDetail = {
            menuId,
            date: e.date,
            dishId: item._id,
          };
          console.log(newMenuDetail);

          await MenuDetail.create(newMenuDetail);
        }
      });
    });
    return menuId;
  } catch (error) {
    throw error;
  }
};

const menuDetailService = { createMenuDetail };

export default menuDetailService;
