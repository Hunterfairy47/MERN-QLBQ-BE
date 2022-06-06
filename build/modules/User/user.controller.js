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
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../../utils/generateToken");
const result_1 = __importDefault(require("../../utils/result"));
const user_model_1 = __importDefault(require("./user.model"));
const user_service_1 = __importDefault(require("./user.service"));
const userController = {
    getUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { users, pagination } = yield user_service_1.default.getAll(req.query);
            result_1.default.success(res, { data: users, pagination });
        }
        catch (err) {
            return next(err);
        }
    }),
    getUserId: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_service_1.default.getOne(req.params.id);
            if (!user) {
                result_1.default.error(res, { message: 'Không tìm thấy tài khoản.' });
                return;
            }
            result_1.default.success(res, { data: user });
        }
        catch (err) {
            return next(err);
        }
    }),
    createUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { firstName, lastName, phone, office, email, password } = req.body;
            const checkUserEmail = yield user_service_1.default.getOneByEmail(email);
            const checkUserPhone = yield user_service_1.default.getOneByPhone(phone);
            if (checkUserEmail) {
                result_1.default.error(res, { message: 'Email này đã tồn tại.' });
                return;
            }
            if (checkUserPhone) {
                result_1.default.error(res, { message: 'Số điện thoại này đã tồn tại.' });
                return;
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 10);
            const newUser = {
                firstName,
                lastName,
                phone,
                office,
                email,
                password: passwordHash,
            };
            const active_token = (0, generateToken_1.generateActiveToken)({ newUser });
            const user1 = new user_model_1.default(newUser);
            const success = yield user_service_1.default.create(user1);
            result_1.default.success(res, { message: 'Create Success!' });
        }
        catch (err) {
            return next(err);
        }
    }),
    updateUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            yield user_service_1.default.update(userId, req.body);
            result_1.default.success(res, { message: 'Update Success!' });
        }
        catch (err) {
            return next(err);
        }
    }),
    deleteUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const deletedUser = yield user_service_1.default.deleteOne(userId);
            result_1.default.success(res, { message: 'Delete Success!', data: deletedUser });
        }
        catch (err) {
            return next(err);
        }
    }),
    uploadUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.file === undefined) {
                result_1.default.error(res, { message: 'Vui lòng tải lên một tệp excel.' });
                return;
            }
            const usersList = yield user_service_1.default.upload(req.file.filename);
            result_1.default.success(res, { message: 'Đã tải tệp lên thành công.', data: usersList });
        }
        catch (err) {
            return next(err);
        }
    }),
    deleteManyUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedUsers = yield user_service_1.default.deleteMany(req.params.ids);
            result_1.default.success(res, { message: `Xóa ${deletedUsers.deletedCount} tài khoản thành công.`, data: deletedUsers });
        }
        catch (err) {
            return next(err);
        }
    }),
};
exports.default = userController;
