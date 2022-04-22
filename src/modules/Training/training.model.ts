import mongoose from 'mongoose';
import { ITrainingLevel } from '../../config/interface';

const trainingSchema = new mongoose.Schema(
  {
    trainingName: {
      type: String,
      required: [true, 'Please add your Training name'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITrainingLevel>('Training', trainingSchema);
