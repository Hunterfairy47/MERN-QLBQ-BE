import mongoose from 'mongoose';
import { IDish } from '../../config/interface';

const dishSchema = new mongoose.Schema(
  {
    dishName: {
      type: String,
      required: [true, 'Please add your dish name'],
    },
    englishName: {
      type: String,
      required: [true, 'Please add your english name'],
    },
    imgUrl: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlXIV_bKc97wHdmbvgu02kmp2i3sHx7ybqcQ&usqp=CAU',
    },
    ingredients: [{ type: String, required: true, ref: 'Ingredient' }],
    typeDishId: { type: mongoose.Types.ObjectId, required: true, ref: 'TypeDish' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDish>('Dish', dishSchema);
