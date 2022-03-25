import mongoose from 'mongoose';
import { ITypeDish } from '../../config/interface';

const typeDishSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    typeDishName: {
      type: String,
      required: [true, 'Please add your typeDishName'],
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

export default mongoose.model<ITypeDish>('TypeDish', typeDishSchema);
