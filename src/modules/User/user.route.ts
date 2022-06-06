import express from 'express';
import auth from '../../middleware/auth';
import authorize from '../../middleware/authorize';
import { uploadFileExcel } from '../../middleware/uploadExcel.middleware';
import userController from './user.controller';

const UserRouter = express.Router();

UserRouter.get('/users', userController.getUsers);
UserRouter.post('/users/create', userController.createUser);
UserRouter.post('/users/upload', auth, authorize('admin'), uploadFileExcel, userController.uploadUsers);
// UserRouter.get('/download', auth, authorize('admin'), userController.downloadStaffs);
UserRouter.delete('/users/:ids/delete_many', auth, authorize('admin'), userController.deleteManyUsers);
UserRouter.route('/users/:id')
  .get(auth, authorize('admin'), userController.getUserId)
  .patch(userController.updateUser)
  .delete(auth, authorize('admin'), userController.deleteUser);

export default UserRouter;
