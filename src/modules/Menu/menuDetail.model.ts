import mongoose from "mongoose";
import { IMenuDetails } from "../../config/interface";

const menuDetailsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    dishId: {
      type: String,
      required: true,
      ref: "Dish",
    },

    menuId: { type: String, required: true, ref: "Menu" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMenuDetails>("MenuDetails", menuDetailsSchema);
