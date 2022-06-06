"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorize_1 = __importDefault(require("../../middleware/authorize"));
const uploadExcel_middleware_1 = require("../../middleware/uploadExcel.middleware");
const user_controller_1 = __importDefault(require("./user.controller"));
const UserRouter = express_1.default.Router();
UserRouter.get('/users', user_controller_1.default.getUsers);
UserRouter.post('/users/create', user_controller_1.default.createUser);
UserRouter.post('/users/upload', auth_1.default, (0, authorize_1.default)('admin'), uploadExcel_middleware_1.uploadFileExcel, user_controller_1.default.uploadUsers);
// UserRouter.get('/download', auth, authorize('admin'), userController.downloadStaffs);
UserRouter.delete('/users/:ids/delete_many', auth_1.default, (0, authorize_1.default)('admin'), user_controller_1.default.deleteManyUsers);
UserRouter.route('/users/:id')
    .get(auth_1.default, (0, authorize_1.default)('admin'), user_controller_1.default.getUserId)
    .patch(user_controller_1.default.updateUser)
    .delete(auth_1.default, (0, authorize_1.default)('admin'), user_controller_1.default.deleteUser);
exports.default = UserRouter;
