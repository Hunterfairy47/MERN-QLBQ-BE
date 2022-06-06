"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dishDetailSchema = new mongoose_1.default.Schema({
    trainingLevelId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Training' },
    dishId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Dish' },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('DishDetail', dishDetailSchema);
