"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const typeDishSchema = new mongoose_1.default.Schema({
    typeDishName: {
        type: String,
        required: [true, 'Please add your typeDishName'],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('TypeDish', typeDishSchema);
