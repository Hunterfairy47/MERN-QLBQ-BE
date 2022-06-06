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
const nutrition_model_1 = __importDefault(require("./nutrition.model"));
const nutritionController = {
    // Get all nutrition
    getNutritions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const nutritions = yield nutrition_model_1.default.find();
            result_1.default.success(res, { data: nutritions });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    // Get Nutrition active
    getNutritionActive: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const nutritionActive = yield nutrition_model_1.default.find({ active: true }).sort({ createdAt: 1 });
            result_1.default.success(res, { data: nutritionActive });
        }
        catch (error) {
            result_1.default.error(res, { message: error });
        }
    }),
    createNutrition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nutritionName } = req.body;
            const nutrition = yield nutrition_model_1.default.findOne({ nutritionName });
            if (nutrition)
                return result_1.default.error(res, { message: 'Nutrition already exists!' });
            const newNutrition = new nutrition_model_1.default(req.body);
            yield newNutrition.save();
            result_1.default.success(res, { message: 'create success!' });
        }
        catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = Object.values(error.keyValue)[0] + ' already exits.';
            }
            result_1.default.error(res, { message: errMsg });
        }
    }),
    updateNutrition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const array = req.body;
            for (let i = 0; i < array.length; i++) {
                yield nutrition_model_1.default.findByIdAndUpdate(array[i]._id, array[i]);
            }
            result_1.default.success(res, { message: 'create success!' });
        }
        catch (error) {
            result_1.default.error(res, { message: error });
        }
    }),
};
exports.default = nutritionController;
