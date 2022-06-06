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
const cloudinary_1 = require("cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const node_1 = __importDefault(require("read-excel-file/node"));
const result_1 = __importDefault(require("../../utils/result"));
const dishDetail_model_1 = __importDefault(require("../DishDetail/dishDetail.model"));
const dishDetail_service_1 = __importDefault(require("../DishDetail/dishDetail.service"));
const ingredient_model_1 = __importDefault(require("../Ingredient/ingredient.model"));
const ingredientDish_model_1 = __importDefault(require("../IngredientDish/ingredientDish.model"));
const ingredientDish_service_1 = __importDefault(require("../IngredientDish/ingredientDish.service"));
const training_model_1 = __importDefault(require("../Training/training.model"));
const typeDish_model_1 = __importDefault(require("../TypeDish/typeDish.model"));
const dish_model_1 = __importDefault(require("./dish.model"));
const fs = require('fs');
const dishController = {
    getDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let aggregate_options = [];
            let search = !!req.query._q;
            let match_regex = { $regex: req.query._q, $options: 'i' };
            aggregate_options.push({
                $lookup: {
                    from: 'typedishes',
                    localField: 'typeDishId',
                    foreignField: '_id',
                    as: 'typeDishes',
                },
            }, {
                $unwind: '$typeDishes',
            });
            aggregate_options.push({
                $lookup: {
                    from: 'dishdetails',
                    localField: '_id',
                    foreignField: 'dishId',
                    as: 'dishdetail',
                },
            }, {
                $unwind: '$dishdetail',
            }, {
                $lookup: {
                    from: 'trainings',
                    localField: 'dishdetail.trainingLevelId',
                    foreignField: '_id',
                    as: 'trainingLevel',
                },
            }, {
                $unwind: '$trainingLevel',
            });
            // Search
            if (search) {
                aggregate_options.push({
                    $match: {
                        $or: [{ dishName: match_regex }],
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
            // Sort dish by type of dish
            let type = String(req.query._type);
            const typeDish = yield typeDish_model_1.default.findOne({ typeDishName: type });
            if (typeDish) {
                aggregate_options.push({
                    $match: {
                        typeDishId: typeDish._id,
                    },
                });
            }
            // Sort dish by training level
            let training = String(req.query._training);
            const trainingLevel = yield training_model_1.default.findOne({ trainingName: training });
            if (trainingLevel) {
                aggregate_options.push({
                    $match: {
                        'trainingLevel._id': trainingLevel._id,
                    },
                });
            }
            // Pagination
            let _page = req.query._page ? +req.query._page : 1;
            let _limit = req.query._limit ? +req.query._limit : 10;
            let _totalRows = yield dish_model_1.default.countDocuments();
            aggregate_options.push({ $skip: (_page - 1) * _limit }, { $limit: _limit });
            //Set up the aggregation
            let data = yield dish_model_1.default.aggregate(aggregate_options);
            result_1.default.success(res, { data, pagination: { _page, _limit, _totalRows } });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    getOne: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield dish_model_1.default.aggregate([
                {
                    $match: {
                        _id: mongoose_1.default.Types.ObjectId(req.params.id),
                    },
                },
                // Find type Dish
                {
                    $lookup: {
                        from: 'typedishes',
                        localField: 'typeDishId',
                        foreignField: '_id',
                        as: 'typeDishes',
                    },
                },
                {
                    $unwind: '$typeDishes',
                },
                // Find training level
                {
                    $lookup: {
                        from: 'dishdetails',
                        localField: '_id',
                        foreignField: 'dishId',
                        as: 'dishdetail',
                    },
                },
                {
                    $unwind: '$dishdetail',
                },
                {
                    $lookup: {
                        from: 'trainings',
                        localField: 'dishdetail.trainingLevelId',
                        foreignField: '_id',
                        as: 'trainingLevel',
                    },
                },
                {
                    $unwind: '$trainingLevel',
                },
                {
                    $lookup: {
                        from: 'ingredientdishes',
                        localField: 'dishdetail._id',
                        foreignField: 'dishDetailId',
                        as: 'ingredients',
                    },
                },
                {
                    $unwind: '$ingredients',
                },
                {
                    $lookup: {
                        from: 'ingredients',
                        localField: 'ingredients.ingredientId',
                        foreignField: '_id',
                        as: 'ingredients.ingredient',
                    },
                },
                {
                    $unwind: '$ingredients.ingredient',
                },
                {
                    $group: {
                        _id: '$_id',
                        imgUrl: { $first: '$imgUrl' },
                        dishName: { $first: '$dishName' },
                        englishName: { $first: '$englishName' },
                        typeDishes: { $first: '$typeDishes' },
                        trainingLevel: { $first: '$trainingLevel' },
                        ingredients: {
                            $push: {
                                _id: '$ingredients.ingredientId',
                                realUnit: '$ingredients.realUnit',
                                realMass: '$ingredients.realMass',
                                standardMass: '$ingredients.ingredient.standardMass',
                                ingredientName: '$ingredients.ingredient.ingredientName',
                                nutritionDetail: '$ingredients.ingredient.nutritionDetail',
                            },
                        },
                    },
                },
                // {
                //   $project: {
                //     typeDishes: 1,
                //   },
                // },
            ]);
            result_1.default.success(res, { data: data[0] });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    // getDishByType: async (req: Request, res: Response) => {
    //   try {
    //     const
    //   } catch (error) {
    //     return Result.error(res, { message: error });
    //   }
    // },
    getAllIngredientDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dishDetail = yield dishDetail_model_1.default.findOne({
                dishId: req.body.dishId,
                trainingLevelId: req.body.trainingLevelId,
            });
            if (dishDetail === null)
                return;
            const dishDetailId = dishDetail._id;
            const data = yield ingredientDish_model_1.default.aggregate([
                {
                    $match: {
                        dishDetailId: mongoose_1.default.Types.ObjectId(dishDetailId),
                    },
                },
                {
                    $lookup: {
                        from: 'ingredients',
                        localField: 'ingredientId',
                        foreignField: '_id',
                        as: 'ingredient',
                    },
                },
                {
                    $unwind: '$ingredient',
                },
                {
                    $addFields: {
                        ingredientName: '$ingredient.ingredientName',
                        nutritionDetail: '$ingredient.nutritionDetail',
                    },
                },
                {
                    $project: {
                        _id: 0,
                        realUnit: 1,
                        realMass: 1,
                        ingredientId: 1,
                        ingredientName: 1,
                        nutritionDetail: 1,
                    },
                },
            ]);
            result_1.default.success(res, { data });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    uploadImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return result_1.default.error(res, { message: 'File is empty' }, 401);
            }
            if (req.file.mimetype === 'image/jpg' ||
                req.file.mimetype === 'image/jpeg' ||
                req.file.mimetype === 'image/png') {
                const uploader = yield cloudinary_1.v2.uploader.upload(req.file.path, { resource_type: 'auto' });
                fs.unlinkSync(req.file.path);
                result_1.default.success(res, { data: uploader });
            }
            else
                return result_1.default.error(res, { message: 'Type file does not support' }, 401);
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    createDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { dishName, trainingLevelId, ingredients } = req.body;
            const dish = yield dish_model_1.default.findOne({ dishName });
            if (dish)
                return result_1.default.error(res, { message: 'Dish already exists!' });
            // Create new Dish
            const newDish = yield dish_model_1.default.create(req.body);
            // Create new DishDetail
            const dishId = newDish._id;
            const dataDishDetail = { trainingLevelId, dishId };
            const dishDetail = yield dishDetail_service_1.default.create(dataDishDetail);
            // Create Ingredient_Dish
            const dishDetailId = dishDetail._id;
            for (let i = 0; i < ingredients.length; i++) {
                let realUnit = ingredients[i].realUnit;
                let realMass = ingredients[i].realMass;
                let ingredientId = ingredients[i].ingredientId;
                const dataIngredientDish = { dishDetailId, realUnit, realMass, ingredientId };
                yield ingredientDish_service_1.default.create(dataIngredientDish);
            }
            result_1.default.success(res, { message: 'create success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    updateIngredientDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ingredientChangeId = mongoose_1.default.Types.ObjectId(req.body.ingredientChange);
            const dishDetail = yield dishDetail_model_1.default.findOne({ dishId: req.body.dishId });
            if (dishDetail === null)
                return;
            const dishDetailId = dishDetail._id;
            const ingredientChange = yield ingredientDish_model_1.default.findOneAndUpdate({ dishDetailId, ingredientId: req.body.ingredientChanged }, { $set: { ingredientId: ingredientChangeId } });
            const data = yield ingredientDish_model_1.default.aggregate([
                {
                    $match: {
                        dishDetailId: mongoose_1.default.Types.ObjectId(dishDetailId),
                    },
                },
                {
                    $lookup: {
                        from: 'ingredients',
                        localField: 'ingredientId',
                        foreignField: '_id',
                        as: 'ingredient',
                    },
                },
                {
                    $unwind: '$ingredient',
                },
                {
                    $addFields: {
                        ingredientName: '$ingredient.ingredientName',
                        nutritionDetail: '$ingredient.nutritionDetail',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        realUnit: 1,
                        realMass: 1,
                        ingredientId: 1,
                        ingredientName: 1,
                        nutritionDetail: 1,
                    },
                },
            ]);
            result_1.default.success(res, { data });
        }
        catch (error) { }
    }),
    updateDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dish = yield dish_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body);
            if (!dish)
                return result_1.default.error(res, { message: 'Dish does not exists!' });
            result_1.default.success(res, { message: 'Update Success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    deleteDish: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Delete img on clound
            const dishImg = yield dish_model_1.default.findOne({ _id: req.params.id });
            const url = dishImg === null || dishImg === void 0 ? void 0 : dishImg.imgUrl;
            const imgUrl = url === null || url === void 0 ? void 0 : url.substring((url === null || url === void 0 ? void 0 : url.lastIndexOf('/')) + 1).split('.')[0];
            yield cloudinary_1.v2.uploader.destroy(imgUrl);
            const dishDetailId = yield dishDetail_model_1.default.findOne({ dishId: req.params.id });
            // Delete IngredientDish
            const dishDetail = yield ingredientDish_model_1.default.find({ dishDetailId: dishDetailId === null || dishDetailId === void 0 ? void 0 : dishDetailId._id });
            for (let i = 0; i < dishDetail.length; i++) {
                yield ingredientDish_model_1.default.findOneAndDelete({ _id: dishDetail[i]._id });
            }
            // Delete DishDetail
            yield dishDetail_model_1.default.findOneAndDelete({ dishId: req.params.id });
            // Delete Dish
            const dish = yield dish_model_1.default.findOneAndDelete({ _id: req.params.id });
            if (!dish)
                return result_1.default.error(res, { message: 'Dish does not exists!' });
            result_1.default.success(res, { message: 'Delete Success!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    uploadDish: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check choosen file
            if (req.file === undefined) {
                return result_1.default.error(res, { message: 'Please up load an excel file!' });
            }
            let excelFile = path_1.default.resolve(__dirname, '../../resources/static/ingredients/uploads/' + req.file.filename);
            (0, node_1.default)(excelFile).then((rows) => __awaiter(void 0, void 0, void 0, function* () {
                // skip header
                rows.shift();
                rows.shift();
                rows.shift();
                let dishInValid = [];
                const typeDishCheck = yield typeDish_model_1.default.find();
                rows.forEach((row, i) => __awaiter(void 0, void 0, void 0, function* () {
                    let typeDishName = String(row[3]);
                    let typeDishId = '';
                    for (let i = 0; i < typeDishCheck.length; i++) {
                        if (typeDishName === typeDishCheck[i].typeDishName) {
                            typeDishId = typeDishCheck[i]._id;
                        }
                    }
                    let dish = new dish_model_1.default({
                        dishName: row[1],
                        englishName: row[2],
                        typeDishId,
                    });
                    // Check exits dish
                    let checkDishExist = yield dish_model_1.default.findOne({ dishName: dish.dishName });
                    let newDish = {
                        _id: '',
                        dishName: '',
                        englishName: '',
                        imgUrl: '',
                        typeDishId: '',
                    };
                    if (checkDishExist) {
                        dishInValid.push(dish);
                    }
                    else {
                        // Create new Dish
                        newDish = yield dish_model_1.default.create(dish);
                    }
                    // Create DishDetail by newDish
                    let dishId = newDish._id.toString();
                    const trainingName = row[4].toString();
                    const training = yield training_model_1.default.findOne({ trainingName });
                    let trainingLevelId = '';
                    if (training) {
                        trainingLevelId = training._id.toString();
                    }
                    const dataDishDetail = { trainingLevelId, dishId };
                    const dishDetail = yield dishDetail_service_1.default.create(dataDishDetail);
                    // Create Ingredient of Dish by dishDetail
                    let dishDetailId = dishDetail._id.toString();
                    let ingredientNameArr = row[5].toString().split(',');
                    let realUnits = row[6].toString().split(',');
                    let realMasses = row[7].toString().split(',');
                    for (let index = 0; index < ingredientNameArr.length; index++) {
                        let ingredientId = '';
                        let realUnit = '';
                        let realMass = 0;
                        const ingredientName = yield ingredient_model_1.default.findOne({ ingredientName: ingredientNameArr[index].trim() });
                        if (ingredientName) {
                            ingredientId = ingredientName._id;
                        }
                        for (let k = 0; k < realUnits.length; k++) {
                            if (index === k) {
                                realUnit = realUnits[k].trim();
                            }
                        }
                        for (let l = 0; l < realMasses.length; l++) {
                            if (index === l) {
                                realMass = Number(realMasses[l].trim());
                            }
                        }
                        let ingredientObj = {
                            dishDetailId,
                            ingredientId,
                            realUnit,
                            realMass,
                        };
                        yield ingredientDish_service_1.default.create(ingredientObj);
                    }
                }));
            }));
            result_1.default.success(res, { message: 'Upload successfully!' });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
};
exports.default = dishController;
