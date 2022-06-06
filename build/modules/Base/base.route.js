"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorize_1 = __importDefault(require("../../middleware/authorize"));
const base_controller_1 = __importDefault(require("./base.controller"));
const BaseRouter = express_1.default.Router();
BaseRouter.route('/base').get(base_controller_1.default.getBase);
BaseRouter.route('/base/create').post(base_controller_1.default.createBase);
BaseRouter.route('/base/:id')
    .patch(auth_1.default, (0, authorize_1.default)('admin'), base_controller_1.default.updateBase)
    .delete(auth_1.default, (0, authorize_1.default)('admin'), base_controller_1.default.deleteBase);
exports.default = BaseRouter;
