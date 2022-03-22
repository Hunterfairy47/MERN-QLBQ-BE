import mongoose from "mongoose";
import { INutrition } from "../config/interface";

const nutritionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    nutritionName: {
      type: String,
      required: [true, "Please add your nutritionName"],
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

export default mongoose.model<INutrition>("Nutrition", nutritionSchema);
