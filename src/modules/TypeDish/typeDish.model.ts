import mongoose from 'mongoose';
import { ITypeDish } from '../../config/interface';

const typeDishSchema = new mongoose.Schema(
  {
    typeDishName: {
      type: String,
      required: [true, 'Please add your typeDishName'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITypeDish>('TypeDish', typeDishSchema);
