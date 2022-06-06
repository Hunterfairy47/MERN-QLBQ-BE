"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ingredientDishSchema = new mongoose_1.default.Schema({
    dishDetailId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'DishDetail' },
    ingredientId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Ingredient' },
    realUnit: { type: String, required: true },
    realMass: { type: Number, required: true },
    price: { type: Number, default: 0 },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('IngredientDish', ingredientDishSchema);
