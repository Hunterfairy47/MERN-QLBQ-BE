"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_validate_1 = require("./auth.validate");
const AuthRouter = express_1.default.Router();
AuthRouter.route('/register').post(auth_validate_1.ValidRegister, auth_controller_1.default.register);
AuthRouter.route('/active').post(auth_controller_1.default.activeAccount);
AuthRouter.route('/auth/login').post(auth_controller_1.default.login);
exports.default = AuthRouter;
