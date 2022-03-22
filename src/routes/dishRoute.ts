import express from "express";
import dishController from "../controllers/dishController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/dish", dishController.getDish);
router.post("/dish/create", auth, dishController.createDish);

export default router;
