import express from "express";
import ingredientController from "../controllers/ingredientController";

const router = express.Router();

router.get("/ingredient", ingredientController.getIngredient);
router.post("/ingredient/create", ingredientController.createIngredient);
router.route("/ingredient/:id").patch(ingredientController.updateIngredient);

export default router;
