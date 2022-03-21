import { Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  phone: string;
  office: string;
  email: string;
  password: string;
  role: string;
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
  newUser?: INewUser;
  iat: number;
  exp: number;
}
