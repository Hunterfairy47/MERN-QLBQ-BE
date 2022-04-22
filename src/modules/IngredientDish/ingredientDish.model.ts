import mongoose from 'mongoose';
import { IIngredientDish } from '../../config/interface';

const ingredientDishSchema = new mongoose.Schema(
  {
    dishDetailId: { type: mongoose.Types.ObjectId, required: true, ref: 'DishDetail' },
    ingredientId: { type: mongoose.Types.ObjectId, required: true, ref: 'Ingredient' },
    realUnit: { type: String, required: true },
    realMass: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IIngredientDish>('IngredientDish', ingredientDishSchema);
