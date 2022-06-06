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
const typeDish_model_1 = __importDefault(require("./typeDish.model"));
const typeDishController = {
    getTypeDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield typeDish_model_1.default.find();
            result_1.default.success(res, { data });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    createTypeDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { typeDishName } = req.body;
            const typeDish = yield typeDish_model_1.default.findOne({ typeDishName });
            if (typeDish)
                return result_1.default.error(res, { message: 'Type of dish already exists!' });
            const newtypeDish = new typeDish_model_1.default(req.body);
            yield newtypeDish.save();
            result_1.default.success(res, { message: 'Create success!' });
        }
        catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = Object.values(error.keyValue)[0] + ' already exits.';
            }
            return result_1.default.error(res, { message: errMsg });
        }
    }),
};
exports.default = typeDishController;
