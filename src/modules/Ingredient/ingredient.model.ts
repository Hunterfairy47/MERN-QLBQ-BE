import mongoose from 'mongoose';
import { Ingredient } from '../../config/interface';

const ingredientSchema = new mongoose.Schema(
  {
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
        _id: false,
        nutritionId: { type: String, ref: 'Nutrition', required: true },
        nutritionValue: { type: Number, required: true, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ingredientSchema.index({ ingredientName: 'text' });

const Ingredients = mongoose.model<Ingredient>('Ingredient', ingredientSchema);

Ingredients.createIndexes({ ingredientName: 'text' });

export default Ingredients;
