"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_middleware_1 = require("../../middleware/image.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const dish_controller_1 = __importDefault(require("./dish.controller"));
const DishRouter = express_1.default.Router();
DishRouter.route('/dish').get(dish_controller_1.default.getDish).post(image_middleware_1.uploadImage, dish_controller_1.default.createDish);
DishRouter.route('/upload').post(image_middleware_1.uploadImage, dish_controller_1.default.uploadImage);
DishRouter.route('/uploadexcel').post(upload_middleware_1.uploadFile, dish_controller_1.default.uploadDish);
DishRouter.route('/dish/change/:id').patch(dish_controller_1.default.updateIngredientDish);
DishRouter.route('/dish/getall').post(dish_controller_1.default.getAllIngredientDish);
DishRouter.route('/dish/:id')
    .get(dish_controller_1.default.getOne)
    .delete(dish_controller_1.default.deleteDish)
    .patch(dish_controller_1.default.updateDish);
exports.default = DishRouter;
