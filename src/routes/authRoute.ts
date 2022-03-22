import express from "express";
import authController from "../controllers/authController";
import { ValidRegister } from "../middleware/validRegister";

const router = express.Router();

router.post("/register", ValidRegister, authController.register);

router.post("/active", authController.activeAccount);

router.post("/login", authController.login);

export default router;
