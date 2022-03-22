import express from "express";
import nutritionController from "../controllers/nutritionController";

const router = express.Router();

router.get("/nutrition", nutritionController.getNutritions);
router.post("/nutrition/create", nutritionController.createNutrition);

export default router;
