import mongoose from 'mongoose';
import { INewUser } from '../../config/interface';

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add your email'],
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Please add your password'],
      min: [8, 'Password must be at least 8 chars.'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INewUser>('Auth', authSchema);
