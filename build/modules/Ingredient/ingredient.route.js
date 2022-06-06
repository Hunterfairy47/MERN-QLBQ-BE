"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorize_1 = __importDefault(require("../../middleware/authorize"));
const upload_middleware_1 = require("../../middleware/upload.middleware");
const ingredient_controller_1 = __importDefault(require("./ingredient.controller"));
const IngredientRouter = express_1.default.Router();
IngredientRouter.route('/ingredient')
    .get(ingredient_controller_1.default.getIngredient)
    .post(ingredient_controller_1.default.createIngredient);
IngredientRouter.route('/ingredient/:id')
    .patch(ingredient_controller_1.default.updateIngredient)
    .delete(auth_1.default, (0, authorize_1.default)('admin'), ingredient_controller_1.default.deleteIngredient);
IngredientRouter.route('/ingredient/upload').post(upload_middleware_1.uploadFile, ingredient_controller_1.default.uploadIngredient);
IngredientRouter.route('/ingredient/getall').get(ingredient_controller_1.default.getAll);
exports.default = IngredientRouter;
