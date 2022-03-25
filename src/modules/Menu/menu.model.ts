import mongoose from 'mongoose';
import { IMenu } from '../../config/interface';

const menuSchema = new mongoose.Schema(
  {
    startDay: {
      type: Date,
      required: [true, 'Please add start day'],
    },
    endDay: {
      type: Date,
      required: [true, 'Please add end day'],
    },
    baseId: { type: String, required: true, ref: 'Base' },
    trainingId: { type: String, required: true, ref: 'Training' },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

export default mongoose.model<IMenu>('Menu', menuSchema);
