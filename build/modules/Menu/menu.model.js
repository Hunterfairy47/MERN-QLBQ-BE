"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menuSchema = new mongoose_1.default.Schema({
    startDate: {
        type: String,
        required: [true, 'Please add start day'],
    },
    endDate: {
        type: String,
        required: [true, 'Please add end day'],
    },
    menuName: {
        type: String,
        required: [true, 'Please add menu name'],
    },
    baseId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Base' },
    trainingLevelId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Training' },
}, {
    autoIndex: true,
    timestamps: true,
});
exports.default = mongoose_1.default.model('Menu', menuSchema);
