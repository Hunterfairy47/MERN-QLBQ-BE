import mongoose from 'mongoose';
import { IMenuDetails } from '../../config/interface';

const menuDetailSchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    dishId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Dish',
    },

    menuId: { type: mongoose.Types.ObjectId, required: true, ref: 'Menu' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMenuDetails>('MenuDetail', menuDetailSchema);
