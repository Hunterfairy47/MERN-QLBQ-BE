"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dishSchema = new mongoose_1.default.Schema({
    dishName: {
        type: String,
        required: [true, 'Please add your dish name'],
    },
    englishName: {
        type: String,
        required: [true, 'Please add your english name'],
    },
    imgUrl: {
        type: String,
        default: 'https://img.freepik.com/vector-gratis/dibujado-mano-ilustracion-ceviche_23-2148793215.jpg',
    },
    typeDishId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'TypeDish' },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Dish', dishSchema);
