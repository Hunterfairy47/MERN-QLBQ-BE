import mongoose from 'mongoose';
import { IBase } from '../../config/interface';

const baseSchema = new mongoose.Schema(
  {
    baseName: {
      type: String,
      required: [true, 'Please add your baseName'],
    },
    address: {
      type: String,
      required: [true, 'Please add your address'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBase>('Base', baseSchema);
