import mongoose from 'mongoose';
import { IDish } from '../../config/interface';

const dishSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    dishName: {
      type: String,
      required: [true, 'Please add your dish name'],
    },
    englishName: {
      type: String,
      required: [true, 'Please add your english name'],
    },
    image: {
      type: String,
      required: true,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlXIV_bKc97wHdmbvgu02kmp2i3sHx7ybqcQ&usqp=CAU',
    },
    ingredients: [{ type: String, required: true, ref: 'Ingredient' }],
    typeDishId: { type: String, required: true, ref: 'TypeDish' },
  },
  {
    _id: false,
    timestamps: true,
  }
);

export default mongoose.model<IDish>('Dish', dishSchema);
