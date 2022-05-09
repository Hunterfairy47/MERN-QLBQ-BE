import { Request } from 'express';
import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  phone: string;
  office: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  _doc: object;
}

export interface INewUser {
  firstname: string;
  lastname: string;
  phone: string;
  office: string;
  email: string;
  password: string;
}

export interface IDecodedToken {
  id?: string;
  newUser?: INewUser;
  iat: number;
  exp: number;
}

export interface INutrition {
  _id: string;
  nutritionName: string;
  active: boolean;
}

interface NewNutrition {
  nutritionId: string;
  nutritionValue: number;
}

export interface Ingredient {
  _id: string;
  ingredientName: string;
  standardMass: number;
  nutritionDetail: NewNutrition[];
}

export interface IBase {
  _id: string;
  baseName: string;
  address: string;
}

export interface ITypeDish {
  _id: string;
  typeDishName: string;
}

export interface IDish {
  _id: string;
  dishName: string;
  englishName: string;
  imgUrl: string;
  typeDishId: string;
}

export interface IReqAuth extends Request {
  user?: IUser;
}

export interface ITrainingLevel {
  _id: string;
  trainingName: string;
}

export interface IMenu {
  startDate: Date;
  endDate: Date;
  baseId: mongoose.Types.ObjectId;
  trainingLevelId: mongoose.Types.ObjectId;
  menuName: string;
}

export interface IIngredientDish {
  dishDetailId: mongoose.Types.ObjectId;
  ingredientId: mongoose.Types.ObjectId;
  realUnit: String;
  realMass: number;
}
export interface IDishDetails {
  _id?: mongoose.Types.ObjectId;
  trainingLevelId: mongoose.Types.ObjectId;
  dishId: mongoose.Types.ObjectId;
}
export interface IMenuDetails {
  dishId: string;
  menuId: string;
  date: Date;
}
