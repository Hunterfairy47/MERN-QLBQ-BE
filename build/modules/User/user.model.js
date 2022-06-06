"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add your firstname'],
        maxLength: [20, 'Your firstname is up to 20 chars long.'],
    },
    lastName: {
        type: String,
        required: [true, 'Please add your lastname'],
        maxLength: [20, 'Your lastname is up to 20 chars long.'],
    },
    phone: {
        type: String,
        required: [true, 'Please add your phone'],
        trim: true,
        maxLength: [10, 'Your phone is up to 10 chars long.'],
    },
    office: {
        type: String,
        required: [true, 'Please add your office'],
    },
    email: {
        type: String,
        required: [true, 'Please add your email'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add your password'],
        min: [8, 'Password must be at least 6 chars.'],
        trim: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    active: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('User', userSchema);
