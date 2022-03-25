import mongoose from 'mongoose';
import { ITrainingLevel } from '../../config/interface';

const trainingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    trainingName: {
      type: String,
      required: [true, 'Please add your Training name'],
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

export default mongoose.model<ITrainingLevel>('Training', trainingSchema);
