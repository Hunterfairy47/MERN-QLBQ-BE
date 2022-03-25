import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import baseController from './base.controller';

const BaseRouter = express.Router();

BaseRouter.route('/base').get(baseController.getBase);
BaseRouter.route('/base/create').post(auth, authorize('admin'), baseController.createBase);
BaseRouter.route('/base/:id')
  .patch(auth, authorize('admin'), baseController.updateBase)
  .delete(auth, authorize('admin'), baseController.deleteBase);

export default BaseRouter;
