import mongoose from 'mongoose';
import { IIngredient } from '../../config/interface';

const ingredientSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    ingredientName: {
      type: String,
      required: [true, 'Please add your ingredientName'],
      trim: true,
    },
    standardMass: {
      type: Number,
      default: 100,
    },
    nutritionDetail: [
      {
        nutritionId: { type: String, ref: 'Nutrition', required: true },
        nutritionValue: { type: Number, required: true },
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  }
);

export default mongoose.model<IIngredient>('Ingredient', ingredientSchema);
