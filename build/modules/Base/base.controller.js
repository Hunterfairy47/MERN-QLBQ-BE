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
const base_model_1 = __importDefault(require("./base.model"));
const baseController = {
    getBase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield base_model_1.default.find();
            result_1.default.success(res, { data });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    createBase: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { baseName } = req.body;
            const ingredient = yield base_model_1.default.findOne({ baseName });
            if (ingredient)
                return result_1.default.error(res, { message: 'Base already exists!' });
            const newBase = new base_model_1.default(req.body);
            yield newBase.save();
            result_1.default.success(res, { message: 'Create Success!' });
        }
        catch (error) {
            next(error);
        }
    }),
    updateBase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const base = yield base_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body);
            if (!base)
                return result_1.default.error(res, { message: 'Base does not exists!' });
            result_1.default.success(res, { message: 'Update Success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error.message });
        }
    }),
    deleteBase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const base = yield base_model_1.default.findOneAndDelete({ _id: req.params.id });
            if (!base)
                return result_1.default.error(res, { message: 'Base does not exists!' });
            result_1.default.success(res, { message: 'Delete Success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error.message });
        }
    }),
};
exports.default = baseController;
