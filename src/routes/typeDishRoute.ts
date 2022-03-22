import express from "express";
import typeDishController from "../controllers/typeDishController";

const router = express.Router();

router.get("/typedish", typeDishController.getTypeDish);
router.post("/typedish/create", typeDishController.createTypeDish);

export default router;
