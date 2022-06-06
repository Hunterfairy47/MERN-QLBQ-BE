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
const menuDetail_model_1 = __importDefault(require("./menuDetail.model"));
const createMenuDetail = (data) => {
    try {
        const menuId = data.menuId;
        for (const e of data.menuDetail) {
            e.dish.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                if (item !== null) {
                    const newMenuDetail = {
                        menuId,
                        date: e.date,
                        dishId: item._id,
                    };
                    yield menuDetail_model_1.default.create(newMenuDetail);
                }
            }));
        }
        return menuId;
    }
    catch (error) {
        throw error;
    }
};
const updateMenuDetail = (data) => {
    try {
        const menuId = data.menuId;
        for (const e of data.menuDetail) {
            e.dish.map((item, i) => __awaiter(void 0, void 0, void 0, function* () {
                if (item !== null) {
                    const newMenuDetail = {
                        menuId,
                        date: e.date,
                        dishId: item._id,
                    };
                    const findMenuDetail = yield menuDetail_model_1.default.findOne({
                        menuId: newMenuDetail.menuId,
                        date: newMenuDetail.date,
                        dishId: newMenuDetail.dishId,
                    });
                    if (findMenuDetail) {
                        yield menuDetail_model_1.default.updateOne(newMenuDetail);
                    }
                    else {
                        yield menuDetail_model_1.default.create(newMenuDetail);
                    }
                }
            }));
        }
        return menuId;
    }
    catch (error) {
        throw error;
    }
};
const menuDetailService = { createMenuDetail, updateMenuDetail };
exports.default = menuDetailService;
