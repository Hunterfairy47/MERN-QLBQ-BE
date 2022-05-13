import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import menuController from './menu.controller';

const MenuRouter = express.Router();

MenuRouter.route('/menu').get(menuController.getAll).post(auth, authorize('admin'), menuController.createMenu);
MenuRouter.route('/menu/:id').get(menuController.getOne).post(menuController.createMenuDetail);
MenuRouter.route('/menu/:menuid/edit/:date').get(menuController.getMenuDetailDate);
// .post(auth, authorize('admin'), menuController.updateMenuDetailsById);
export default MenuRouter;
