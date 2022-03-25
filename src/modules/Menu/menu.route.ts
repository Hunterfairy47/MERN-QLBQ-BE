import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import menuController from './menu.controller';

const MenuRouter = express.Router();

MenuRouter.route('/menu').post(auth, authorize('admin'), menuController.createMenu);
MenuRouter.route('/menu/detail').post(auth, authorize('admin'), menuController.createMenuDetails);

MenuRouter.route('/menu/detail/:id')
  .get(auth, authorize('admin'), menuController.getMenuDetailsById)
  .post(auth, authorize('admin'), menuController.updateMenuDetailsById);
export default MenuRouter;
