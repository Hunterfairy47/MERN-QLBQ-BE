"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const training_controller_1 = __importDefault(require("./training.controller"));
const TrainingRouter = express_1.default.Router();
TrainingRouter.route('/training').get(training_controller_1.default.getTraining).post(training_controller_1.default.createTraining);
exports.default = TrainingRouter;
