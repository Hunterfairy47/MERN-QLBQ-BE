import express from 'express';
import authController from './auth.controller';
import { ValidRegister } from './auth.validate';

const AuthRouter = express.Router();

AuthRouter.route('/register').post(ValidRegister, authController.register);

AuthRouter.route('/active').post(authController.activeAccount);

AuthRouter.route('/login').post(authController.login);

export default AuthRouter;
