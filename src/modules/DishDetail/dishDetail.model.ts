import mongoose from 'mongoose';
import { IDishDetails } from '../../config/interface';

const dishDetailSchema = new mongoose.Schema(
  {
    trainingLevelId: { type: mongoose.Types.ObjectId, required: true, ref: 'Training' },
    dishId: { type: mongoose.Types.ObjectId, required: true, ref: 'Dish' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDishDetails>('DishDetail', dishDetailSchema);
