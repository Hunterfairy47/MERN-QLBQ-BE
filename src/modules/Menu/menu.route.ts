import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import menuController from './menu.controller';

const MenuRouter = express.Router();

MenuRouter.route('/menu')
  .get(auth, authorize('admin'), menuController.getAll)
  .post(auth, authorize('admin'), menuController.createMenu);
MenuRouter.route('/menu/menudate').post(auth, menuController.getOneByDate);
MenuRouter.route('/menu/:id')
  .get(auth, authorize('admin'), menuController.getOne)
  .post(auth, authorize('admin'), menuController.createMenuDetail)
  .patch(auth, authorize('admin'), menuController.updateMenuDetail);
MenuRouter.route('/menu/:menuid/edit/:date').get(auth, authorize('admin'), menuController.getMenuDetailDate);
MenuRouter.route('/menu/update/menudate').patch(auth, authorize('admin'), menuController.updateMenuDetailDate);
MenuRouter.route('/menu/export/menudate').post(auth, authorize('admin'), menuController.exportMenuDetailDate);
export default MenuRouter;
