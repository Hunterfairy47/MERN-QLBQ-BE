"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = __importDefault(require("../../utils/result"));
const training_model_1 = __importDefault(require("./training.model"));
const trainingController = {
    getTraining: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield training_model_1.default.find();
            result_1.default.success(res, { data });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    createTraining: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { trainingName } = req.body;
            const trainingLevel = yield training_model_1.default.findOne({ trainingName });
            if (trainingLevel)
                return result_1.default.error(res, { message: 'Training Level already exists!' });
            const newTrainingLevel = new training_model_1.default(req.body);
            yield newTrainingLevel.save();
            result_1.default.success(res, { message: 'Create success!' });
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = trainingController;