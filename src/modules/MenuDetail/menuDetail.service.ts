import { IMenuDetailProps } from '../../config/interface';
import MenuDetail from './menuDetail.model';

const createMenuDetail = (data: IMenuDetailProps) => {
  try {
    const menuId = data.menuId;
    for (const e of data.menuDetail) {
      e.dish.map(async (item) => {
        if (item !== null) {
          const newMenuDetail = {
            menuId,
            date: e.date,
            dishId: item._id,
          };
          await MenuDetail.create(newMenuDetail);
        }
      });
    }
    return menuId;
  } catch (error) {
    throw error;
  }
};

const updateMenuDetail = (data: IMenuDetailProps) => {
  try {
    const menuId = data.menuId;
    for (const e of data.menuDetail) {
      e.dish.map(async (item, i) => {
        if (item !== null) {
          const newMenuDetail = {
            menuId,
            date: e.date,
            dishId: item._id,
          };

          const findMenuDetail = await MenuDetail.findOne({
            menuId: newMenuDetail.menuId,
            date: newMenuDetail.date,
            dishId: newMenuDetail.dishId,
          });

          if (findMenuDetail) {
            await MenuDetail.updateOne(newMenuDetail);
          } else {
            await MenuDetail.create(newMenuDetail);
          }
        }
      });
    }

    return menuId;
  } catch (error) {
    throw error;
  }
};

const menuDetailService = { createMenuDetail, updateMenuDetail };

export default menuDetailService;
