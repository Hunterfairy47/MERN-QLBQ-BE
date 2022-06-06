"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nutrition_controller_1 = __importDefault(require("./nutrition.controller"));
const NutritionRouter = express_1.default.Router();
NutritionRouter.route('/nutrition').get(nutrition_controller_1.default.getNutritions).patch(nutrition_controller_1.default.updateNutrition);
NutritionRouter.route('/nutrition/active').get(nutrition_controller_1.default.getNutritionActive);
NutritionRouter.route('/nutrition/create').post(nutrition_controller_1.default.createNutrition);
exports.default = NutritionRouter;
