import mongoose from 'mongoose';
import { IDishDetails } from '../../config/interface';

const dishDetailsSchema = new mongoose.Schema(
  {
    menuDetailsId: { type: String, required: true, ref: 'MenuDetails' },
    ingredientId: { type: String, ref: 'Ingredient', required: true },
    quantity: { type: Number, required: true },
    realUnit: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

export default mongoose.model<IDishDetails>('DishDetails', dishDetailsSchema);
