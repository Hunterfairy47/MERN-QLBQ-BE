import { Request, Response } from "express";

const getIngredients = (req: Request, res: Response) => {
  res.status(200).json({ message: "Get Ingredients" });
};

module.exports = {
  getIngredients,
};
