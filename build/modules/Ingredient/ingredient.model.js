"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ingredientSchema = new mongoose_1.default.Schema({
    ingredientName: {
        type: String,
        required: [true, 'Please add your ingredientName'],
        trim: true,
    },
    standardMass: {
        type: Number,
        default: 100,
    },
    nutritionDetail: [
        {
            _id: false,
            nutritionId: { type: String, ref: 'Nutrition', required: true },
            nutritionValue: { type: Number, required: true, default: 0 },
        },
    ],
}, {
    timestamps: true,
});
ingredientSchema.index({ ingredientName: 'text' });
const Ingredients = mongoose_1.default.model('Ingredient', ingredientSchema);
Ingredients.createIndexes({ ingredientName: 'text' });
exports.default = Ingredients;
