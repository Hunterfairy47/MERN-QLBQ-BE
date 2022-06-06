import mongoose from 'mongoose';
import { IMenu } from '../../config/interface';

const menuSchema = new mongoose.Schema(
  {
    startDate: {
      type: String,
      required: [true, 'Please add start day'],
    },
    endDate: {
      type: String,
      required: [true, 'Please add end day'],
    },
    menuName: {
      type: String,
      required: [true, 'Please add menu name'],
    },
    baseId: { type: mongoose.Types.ObjectId, required: true, ref: 'Base' },
    trainingLevelId: { type: mongoose.Types.ObjectId, required: true, ref: 'Training' },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

export default mongoose.model<IMenu>('Menu', menuSchema);
