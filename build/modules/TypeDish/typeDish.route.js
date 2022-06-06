"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeDish_controller_1 = __importDefault(require("./typeDish.controller"));
const TypeDishRouter = express_1.default.Router();
TypeDishRouter.route('/typedish').get(typeDish_controller_1.default.getTypeDish);
TypeDishRouter.route('/typedish/create').post(typeDish_controller_1.default.createTypeDish);
exports.default = TypeDishRouter;
