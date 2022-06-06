"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("../modules/Auth/auth.route"));
const base_route_1 = __importDefault(require("../modules/Base/base.route"));
const dish_route_1 = __importDefault(require("../modules/Dish/dish.route"));
const ingredient_route_1 = __importDefault(require("../modules/Ingredient/ingredient.route"));
const menu_route_1 = __importDefault(require("../modules/Menu/menu.route"));
const nutrition_route_1 = __importDefault(require("../modules/Nutrition/nutrition.route"));
const training_route_1 = __importDefault(require("../modules/Training/training.route"));
const typeDish_route_1 = __importDefault(require("../modules/TypeDish/typeDish.route"));
const user_route_1 = __importDefault(require("../modules/User/user.route"));
const routes = [
    auth_route_1.default,
    nutrition_route_1.default,
    ingredient_route_1.default,
    base_route_1.default,
    typeDish_route_1.default,
    dish_route_1.default,
    training_route_1.default,
    menu_route_1.default,
    user_route_1.default,
];
exports.default = routes;
