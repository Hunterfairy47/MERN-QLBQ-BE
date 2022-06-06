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
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const result_1 = __importDefault(require("../../utils/result"));
const ingredientDish_model_1 = __importDefault(require("../IngredientDish/ingredientDish.model"));
const menuDetail_model_1 = __importDefault(require("../MenuDetail/menuDetail.model"));
const menuDetail_service_1 = __importDefault(require("../MenuDetail/menuDetail.service"));
const menu_model_1 = __importDefault(require("./menu.model"));
const menu_service_1 = __importDefault(require("./menu.service"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const menuController = {
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let aggregate_options = [];
            let search = !!req.query._q;
            let match_regex = { $regex: req.query._q, $options: 'i' };
            aggregate_options.push({
                $lookup: {
                    from: 'trainings',
                    localField: 'trainingLevelId',
                    foreignField: '_id',
                    as: 'trainingLevel',
                },
            }, {
                $unwind: '$trainingLevel',
            });
            // Pagination
            let _page = req.query._page ? +req.query._page : 1;
            let _limit = req.query._limit ? +req.query._limit : 10;
            let _totalRows = yield menu_model_1.default.countDocuments();
            aggregate_options.push({ $skip: (_page - 1) * _limit }, { $limit: _limit });
            //Set up the aggregation
            let data = yield menu_model_1.default.aggregate(aggregate_options);
            result_1.default.success(res, { data, pagination: { _page, _limit, _totalRows } });
        }
        catch (error) { }
    }),
    getMenuDetailDate: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const date = req.params.date;
            const menuId = ObjectId(req.params.menuid);
            const data = yield menuDetail_model_1.default.aggregate([
                {
                    $match: { date, menuId },
                },
                {
                    $lookup: {
                        from: 'menus',
                        let: { menuDetail_menuId: '$menuId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$menuDetail_menuId'] },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'trainings',
                                    let: { trainingId: '$trainingLevelId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$trainingId'] },
                                            },
                                        },
                                    ],
                                    as: 'training',
                                },
                            },
                            {
                                $unwind: '$training',
                            },
                        ],
                        as: 'menu',
                    },
                },
                {
                    $unwind: '$menu',
                },
                {
                    $lookup: {
                        from: 'dishes',
                        let: { menuDetail_dishId: '$dishId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$menuDetail_dishId'] },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'typedishes',
                                    let: { typeDishId: '$typeDishId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$typeDishId'] },
                                            },
                                        },
                                    ],
                                    as: 'typedish',
                                },
                            },
                            {
                                $unwind: '$typedish',
                            },
                        ],
                        as: 'dish',
                    },
                },
                {
                    $unwind: '$dish',
                },
                {
                    $lookup: {
                        from: 'dishdetails',
                        localField: 'dish._id',
                        foreignField: 'dishId',
                        let: { menu_trainingLevelId: '$menu.trainingLevelId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$trainingLevelId', '$$menu_trainingLevelId'] },
                                },
                            },
                        ],
                        as: 'dish.dishdetail',
                    },
                },
                {
                    $unwind: '$dish.dishdetail',
                },
                {
                    $lookup: {
                        from: 'ingredientdishes',
                        let: { dishdetailId: '$dish.dishdetail._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$dishDetailId', '$$dishdetailId'] },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'ingredients',
                                    let: { ingredientId: '$ingredientId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ['$_id', '$$ingredientId'] },
                                            },
                                        },
                                    ],
                                    as: 'ingredient',
                                },
                            },
                            {
                                $unwind: '$ingredient',
                            },
                        ],
                        as: 'dish.ingredientdish',
                    },
                },
                {
                    $group: {
                        _id: null,
                        menuId: { $first: '$menuId' },
                        date: { $first: '$date' },
                        trainingLevelName: { $first: '$menu.training.trainingName' },
                        menuDetail: {
                            $push: {
                                dishId: '$dish._id',
                                dishName: '$dish.dishName',
                                typeDishName: '$dish.typedish.typeDishName',
                                dishDetailId: '$dish.dishdetail._id',
                                ingredientdish: '$dish.ingredientdish',
                            },
                        },
                    },
                },
            ]);
            result_1.default.success(res, { data: data[0] });
        }
        catch (error) {
            next(error);
        }
    }),
    updateMenuDetailDate: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const menuDetail = req.body.menuDetail;
            menuDetail.forEach((e) => {
                const dishDetailId = e.dishDetailId;
                e.ingredientdish.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const ingredientId = item.ingredientId;
                    yield ingredientDish_model_1.default.findOneAndUpdate({ dishDetailId, ingredientId }, item);
                }));
            });
            result_1.default.success(res, { message: 'Save success!' });
        }
        catch (error) {
            next(error);
        }
    }),
    getOne: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield menu_model_1.default.aggregate([
                {
                    $match: {
                        _id: mongoose_1.default.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: 'trainings',
                        localField: 'trainingLevelId',
                        foreignField: '_id',
                        as: 'trainingLevel',
                    },
                },
                {
                    $unwind: '$trainingLevel',
                },
                {
                    $lookup: {
                        from: 'menudetails',
                        localField: '_id',
                        foreignField: 'menuId',
                        as: 'menuDetails',
                    },
                },
                {
                    $unwind: { path: '$menuDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'dishes',
                        localField: 'menuDetails.dishId',
                        foreignField: '_id',
                        as: 'menuDetails.dish',
                    },
                },
                {
                    $unwind: { path: '$menuDetails.dish', preserveNullAndEmptyArrays: true },
                },
                {
                    $group: {
                        _id: null,
                        menuId: { $first: '$_id' },
                        startDate: { $first: '$startDate' },
                        endDate: { $first: '$endDate' },
                        trainingLevelName: { $first: '$trainingLevel.trainingName' },
                        menuDetail: {
                            $push: {
                                date: '$menuDetails.date',
                                dishes: {
                                    _id: '$menuDetails.dish._id',
                                    dishName: '$menuDetails.dish.dishName',
                                },
                            },
                        },
                    },
                },
            ]);
            result_1.default.success(res, { data: data[0] });
        }
        catch (error) { }
    }),
    getOneByDate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const startDate = req.body.startDate;
            const trainingLevelId = req.body.trainingLevelId;
            const menuId = yield menu_model_1.default.findOne({
                startDate,
                trainingLevelId,
            });
            const data = yield menu_model_1.default.aggregate([
                {
                    $match: {
                        _id: mongoose_1.default.Types.ObjectId(menuId === null || menuId === void 0 ? void 0 : menuId._id),
                    },
                },
                {
                    $lookup: {
                        from: 'trainings',
                        localField: 'trainingLevelId',
                        foreignField: '_id',
                        as: 'trainingLevel',
                    },
                },
                {
                    $unwind: '$trainingLevel',
                },
                {
                    $lookup: {
                        from: 'menudetails',
                        localField: '_id',
                        foreignField: 'menuId',
                        as: 'menuDetails',
                    },
                },
                {
                    $unwind: { path: '$menuDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'dishes',
                        localField: 'menuDetails.dishId',
                        foreignField: '_id',
                        as: 'menuDetails.dish',
                    },
                },
                {
                    $unwind: { path: '$menuDetails.dish', preserveNullAndEmptyArrays: true },
                },
                {
                    $group: {
                        _id: null,
                        menuId: { $first: '$_id' },
                        startDate: { $first: '$startDate' },
                        endDate: { $first: '$endDate' },
                        trainingLevelName: { $first: '$trainingLevel.trainingName' },
                        menuDetail: {
                            $push: {
                                date: '$menuDetails.date',
                                dishes: {
                                    _id: '$menuDetails.dish._id',
                                    dishName: '$menuDetails.dish.dishName',
                                    englishName: '$menuDetails.dish.englishName',
                                },
                            },
                        },
                    },
                },
            ]);
            result_1.default.success(res, { data: data[0] });
        }
        catch (error) { }
    }),
    createMenu: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { menuName, startDate, endDate, trainingLevelId, baseId } = req.body;
            const menus = yield menu_model_1.default.findOne({ menuName });
            if (menus)
                return result_1.default.error(res, { message: 'Menu already exists!' });
            const newStartDate = (0, moment_1.default)(startDate).format('DD/MM/YYYY');
            const newEndDate = (0, moment_1.default)(endDate).format('DD/MM/YYYY');
            const newMenu = new menu_model_1.default({ menuName, startDate: newStartDate, endDate: newEndDate, trainingLevelId, baseId });
            const data = yield newMenu.save();
            result_1.default.success(res, { data, message: 'Create success!' });
        }
        catch (error) {
            next(error);
        }
    }),
    createMenuDetail: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield menuDetail_service_1.default.createMenuDetail(req.body);
            result_1.default.success(res, { data });
        }
        catch (error) {
            next(error);
        }
    }),
    updateMenuDetail: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield menuDetail_service_1.default.updateMenuDetail(req.body);
            result_1.default.success(res, { data });
        }
        catch (error) {
            next(error);
        }
    }),
    exportMenuDetailDate: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield menu_service_1.default.exportExcel(req.body);
        }
        catch (error) {
            next(error);
        }
    }),
};
exports.default = menuController;
