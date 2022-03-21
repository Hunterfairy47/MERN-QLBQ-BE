import express from "express";
import authController from "../controllers/authController";
import { ValidRegister } from "../middleware/validRegister";

const router = express.Router();

// router.post(
//   "/signup",
//   body("email").isEmail().withMessage("The email invalid"),
//   body("password")
//     .isLength({ min: 8 })
//     .withMessage("password must at least 8 character!"),
//   async (req, res) => {
//     const validationErrors = validationResult(req);

//     if (!validationErrors.isEmpty()) {
//       const errors = validationErrors.array().map((error) => {
//         return {
//           msg: error.msg,
//         };
//       });

//       return res.json({ errors });
//     }

//     const { email, password } = req.body;
//     res.json({
//       email,
//       password,
//     });
//   }
// );

router.post("/register", ValidRegister, authController.register);

router.post("/active", authController.activeAccount);

export default router;
