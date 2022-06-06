"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menu_controller_1 = __importDefault(require("./menu.controller"));
const MenuRouter = express_1.default.Router();
MenuRouter.route('/menu').get(menu_controller_1.default.getAll).post(menu_controller_1.default.createMenu);
MenuRouter.route('/menu/menudate').post(menu_controller_1.default.getOneByDate);
MenuRouter.route('/menu/:id')
    .get(menu_controller_1.default.getOne)
    .post(menu_controller_1.default.createMenuDetail)
    .patch(menu_controller_1.default.updateMenuDetail);
MenuRouter.route('/menu/:menuid/edit/:date').get(menu_controller_1.default.getMenuDetailDate);
MenuRouter.route('/menu/update/menudate').patch(menu_controller_1.default.updateMenuDetailDate);
MenuRouter.route('/menu/export/menudate').post(menu_controller_1.default.exportMenuDetailDate);
// .post(auth, authorize('admin'), menuController.updateMenuDetailsById);
exports.default = MenuRouter;
