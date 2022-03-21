import { Request, Response } from "express";
const express = require("express");
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Get Ingredients" });
});

router.post("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "post Ingredients" });
});

module.exports = router;
