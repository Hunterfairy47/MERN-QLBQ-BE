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
      default: 'https://img.freepik.com/vector-gratis/dibujado-mano-ilustracion-ceviche_23-2148793215.jpg',
    },
    typeDishId: { type: mongoose.Types.ObjectId, required: true, ref: 'TypeDish' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDish>('Dish', dishSchema);
