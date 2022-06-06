"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const authSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, 'Please add your email'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add your password'],
        min: [8, 'Password must be at least 8 chars.'],
        trim: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Auth', authSchema);
