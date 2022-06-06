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
const path_1 = __importDefault(require("path"));
const node_1 = __importDefault(require("read-excel-file/node"));
const result_1 = __importDefault(require("../../utils/result"));
const dish_model_1 = __importDefault(require("../Dish/dish.model"));
const nutrition_model_1 = __importDefault(require("../Nutrition/nutrition.model"));
const ingredient_model_1 = __importDefault(require("./ingredient.model"));
const ingredientController = {
    getIngredient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let aggregate_options = [];
            let search = !!req.query._q;
            let match_regex = { $regex: req.query._q, $options: 'i' };
            // Search
            if (search) {
                aggregate_options.push({
                    $match: {
                        $or: [{ ingredientName: match_regex }],
                    },
                });
            }
            // Sorting
            let sort_order = req.query._order && req.query._order === 'asc' ? 1 : -1;
            let sort_by = req.query._sort || 'createdAt';
            aggregate_options.push({
                $sort: {
                    [sort_by]: sort_order,
                },
            });
            // Pagination
            let _page = req.query._page ? +req.query._page : 1;
            let _limit = req.query._limit ? +req.query._limit : 10;
            let _totalRows = yield ingredient_model_1.default.countDocuments();
            aggregate_options.push({ $skip: (_page - 1) * _limit }, { $limit: _limit });
            // sorting ingredients
            let nutrition = String(req.query._nutrition);
            let _sign = req.query._sign;
            let _value = Number(req.query._value);
            const nutritionName = yield nutrition_model_1.default.findOne({ nutritionName: nutrition });
            if (nutrition && _sign && _value) {
                if (_sign === 'equal') {
                    aggregate_options.push({
                        $match: {
                            nutritionDetail: {
                                $all: [
                                    {
                                        $elemMatch: {
                                            nutritionId: nutritionName === null || nutritionName === void 0 ? void 0 : nutritionName._id,
                                            nutritionValue: { $eq: _value },
                                        },
                                    },
                                ],
                            },
                        },
                    });
                }
                else if (_sign === 'less') {
                    aggregate_options.push({
                        $match: {
                            nutritionDetail: {
                                $all: [
                                    {
                                        $elemMatch: {
                                            nutritionId: nutritionName === null || nutritionName === void 0 ? void 0 : nutritionName._id,
                                            nutritionValue: { $lt: _value },
                                        },
                                    },
                                ],
                            },
                        },
                    });
                }
                else if (_sign === 'lessThan') {
                    aggregate_options.push({
                        $match: {
                            nutritionDetail: {
                                $all: [
                                    {
                                        $elemMatch: {
                                            nutritionId: nutritionName === null || nutritionName === void 0 ? void 0 : nutritionName._id,
                                            nutritionValue: { $lte: _value },
                                        },
                                    },
                                ],
                            },
                        },
                    });
                }
                else if (_sign === 'more') {
                    aggregate_options.push({
                        $match: {
                            nutritionDetail: {
                                $all: [
                                    {
                                        $elemMatch: {
                                            nutritionId: nutritionName === null || nutritionName === void 0 ? void 0 : nutritionName._id,
                                            nutritionValue: { $gt: _value },
                                        },
                                    },
                                ],
                            },
                        },
                    });
                }
                else if (_sign === 'greaterThan') {
                    aggregate_options.push({
                        $match: {
                            nutritionDetail: {
                                $all: [
                                    {
                                        $elemMatch: {
                                            nutritionId: nutritionName === null || nutritionName === void 0 ? void 0 : nutritionName._id,
                                            nutritionValue: { $gte: _value },
                                        },
                                    },
                                ],
                            },
                        },
                    });
                }
            }
            //Set up the aggregation
            let data = yield ingredient_model_1.default.aggregate(aggregate_options);
            result_1.default.success(res, { data, pagination: { _page, _limit, _totalRows } });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield ingredient_model_1.default.find();
            result_1.default.success(res, { data });
        }
        catch (error) { }
    }),
    createIngredient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ingredientName } = req.body;
            // const { nutritionDetail } = req.body;
            // const nutrition = await Nutrition.find();
            // let newNutritionDetail = [...nutritionDetail];
            // nutrition.forEach((item) => {
            //   nutritionDetail.forEach((e: { nutritionId: string; nutritionValue: string }) => {
            //     if (item._id !== e.nutritionId) {
            //       newNutritionDetail.push({ nutritionId: item._id, nutritionValue: '0' });
            //     }
            //   });
            // });
            const ingredient = yield ingredient_model_1.default.findOne({ ingredientName });
            if (ingredient)
                return result_1.default.error(res, { message: 'Ingredient already exists!' });
            yield ingredient_model_1.default.create(req.body);
            result_1.default.success(res, { message: 'Create success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: Object.values(error.keyValue)[0] + ' already exits.' });
        }
    }),
    updateIngredient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ingredient = yield ingredient_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body);
            if (!ingredient)
                return result_1.default.error(res, { message: 'Ingredient does not exists!' });
            result_1.default.success(res, { message: 'Update Success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    deleteIngredient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dish = yield dish_model_1.default.findOne({ ingredients: req.params.id });
            if (dish)
                return result_1.default.error(res, { message: 'Can not delete ingredient. This ingredient is present in the dish.' });
            const ingredient = yield ingredient_model_1.default.findOneAndDelete({ _id: req.params.id });
            if (!ingredient)
                return result_1.default.error(res, { message: 'Ingredient does not exists!' });
            result_1.default.success(res, { message: 'Delete Success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    uploadIngredient: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.file === undefined) {
                return result_1.default.error(res, { message: 'Please up load an excel file!' });
            }
            let excelFile = path_1.default.resolve(__dirname, '../../resources/static/ingredients/uploads/' + req.file.filename);
            (0, node_1.default)(excelFile).then((rows) => __awaiter(void 0, void 0, void 0, function* () {
                // skip header
                rows.shift();
                rows.shift();
                //
                const nutritions = yield nutrition_model_1.default.find();
                let nutritionDetail = [];
                rows.forEach((row) => {
                    let nutritionFromFile = {
                        Calo: row[3],
                        Béo: row[4],
                        Đường: row[5],
                        Đạm: row[6],
                    };
                    for (let [key, value] of Object.entries(nutritionFromFile)) {
                        nutritions.map((nutrition) => {
                            if (nutrition.nutritionName === key) {
                                key = nutrition._id;
                            }
                        });
                        const item = {
                            ingredient: row[1],
                            nutritionId: key,
                            nutritionValue: value,
                        };
                        console.log(item);
                        nutritionDetail.push(item);
                    }
                });
                let ingredients = [];
                rows.forEach((row) => __awaiter(void 0, void 0, void 0, function* () {
                    let nutritionArr = [];
                    nutritionDetail.map((item) => {
                        if (item.ingredient === row[1]) {
                            let itemArr = {
                                nutritionId: item.nutritionId,
                                nutritionValue: item.nutritionValue,
                            };
                            nutritionArr.push(itemArr);
                        }
                    });
                    let ingredient = new ingredient_model_1.default({
                        ingredientName: row[1],
                        standardMass: row[2],
                        nutritionDetail: nutritionArr,
                    });
                    console.log('row', ingredient);
                    ingredients.push(ingredient);
                }));
                const ingredientList = yield ingredient_model_1.default.create(ingredients);
                result_1.default.success(res, { message: 'Upload file successfully.', data: ingredientList });
            }));
        }
        catch (error) {
            return next(error);
        }
    }),
};
exports.default = ingredientController;
