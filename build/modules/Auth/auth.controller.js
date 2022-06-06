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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const senMail_1 = __importDefault(require("../../config/senMail"));
const generateToken_1 = require("../../utils/generateToken");
const result_1 = __importDefault(require("../../utils/result"));
const user_model_1 = __importDefault(require("../User/user.model"));
const auth_model_1 = __importDefault(require("./auth.model"));
const auth_validate_1 = require("./auth.validate");
const CLIENT_URL = `${process.env.BASE_URL}`;
const authController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { firstname, lastname, phone, office, email, password } = req.body;
            const user = yield auth_model_1.default.findOne({ email });
            if (user)
                return result_1.default.error(res, { message: 'Email already exists!' }, 401);
            const passwordHash = yield bcrypt_1.default.hash(password, 10);
            const newUser = {
                firstname,
                lastname,
                phone,
                office,
                email,
                password: passwordHash,
            };
            const active_token = (0, generateToken_1.generateActiveToken)({ newUser });
            const user1 = new auth_model_1.default(newUser);
            yield user1.save();
            const url = `${CLIENT_URL}/active/${active_token}`;
            if ((0, auth_validate_1.validateEmail)(email)) {
                (0, senMail_1.default)(email, url, 'Verify your email address');
                res.json({
                    msg: 'Success! Please check your email.',
                });
            }
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
    activeAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_token } = req.body;
            const decoded = jsonwebtoken_1.default.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);
            const { newUser } = decoded;
            if (!newUser)
                return result_1.default.error(res, { message: 'Invalid authentication.' });
            const user = new auth_model_1.default(newUser);
            yield user.save();
            result_1.default.success(res, {
                message: `Account has been verify by ${newUser.email} ! waiting until management active your account!`,
            });
        }
        catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = Object.values(error.keyValue)[0] + 'already exits.';
            }
            return result_1.default.error(res, { message: errMsg });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // const user = await Users.findOne({ email });
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                return result_1.default.error(res, { message: 'This account does not exits.' });
            }
            //if user exits
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return result_1.default.error(res, { message: 'Password is incorrect.' });
            }
            const access_token = (0, generateToken_1.generateAccessToken)(user);
            result_1.default.success(res, { access_token, user });
        }
        catch (error) {
            return result_1.default.error(res, { message: error });
        }
    }),
};
exports.default = authController;
