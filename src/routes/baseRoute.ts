import express from "express";
import baseController from "../controllers/baseController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/base", baseController.getBase);
router.post("/base/create", auth, baseController.createBase);
router
  .route("/base/:id")
  .patch(auth, baseController.updateBase)
  .delete(auth, baseController.deleteBase);

export default router;
