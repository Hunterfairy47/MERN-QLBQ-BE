"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nutritionSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        trim: true,
    },
    nutritionName: {
        type: String,
        required: [true, 'Please add your nutritionName'],
        trim: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
}, {
    _id: false,
    timestamps: true,
});
exports.default = mongoose_1.default.model('Nutrition', nutritionSchema);
