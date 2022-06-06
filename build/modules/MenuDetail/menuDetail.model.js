"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menuDetailSchema = new mongoose_1.default.Schema({
    date: {
        type: String,
    },
    dishId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Dish',
    },
    menuId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Menu' },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('MenuDetail', menuDetailSchema);
