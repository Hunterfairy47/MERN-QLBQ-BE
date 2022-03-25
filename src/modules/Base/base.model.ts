import mongoose from 'mongoose';
import { IBase } from '../../config/interface';

const baseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    baseName: {
      type: String,
      required: [true, 'Please add your baseName'],
    },
    address: {
      type: String,
      required: [true, 'Please add your address'],
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

export default mongoose.model<IBase>('Base', baseSchema);
