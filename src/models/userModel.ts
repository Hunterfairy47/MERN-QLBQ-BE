import mongoose from "mongoose";
import { IUser } from "../config/interface";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please add your firstname"],
      trim: true,
      maxLength: [20, "Your firstname is up to 20 chars long."],
    },

    lastname: {
      type: String,
      required: [true, "Please add your lastname"],
      trim: true,
      maxLength: [20, "Your lastname is up to 20 chars long."],
    },

    phone: {
      type: String,
      required: [true, "Please add your phone"],
      trim: true,
      maxLength: [10, "Your phone is up to 10 chars long."],
    },

    office: {
      type: String,
      required: [true, "Please add your office"],
    },

    email: {
      type: String,
      required: [true, "Please add your email"],
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please add your password"],
      min: [8, "Password must be at least 6 chars."],
      trim: true,
    },

    role: {
      type: String,
      default: "user",
    },

    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
