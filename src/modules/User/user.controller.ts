import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { generateActiveToken } from '../../utils/generateToken';
import Result from '../../utils/result';
import userModel from './user.model';
import userService from './user.service';

const userController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { users, pagination } = await userService.getAll(req.query);
      Result.success(res, { data: users, pagination });
    } catch (err: any) {
      return next(err);
    }
  },

  getUserId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getOne(req.params.id);

      if (!user) {
        Result.error(res, { message: 'Không tìm thấy tài khoản.' });
        return;
      }
      Result.success(res, { data: user });
    } catch (err: any) {
      return next(err);
    }
  },

  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, phone, office, email, password } = req.body;
      const checkUserEmail = await userService.getOneByEmail(email);
      const checkUserPhone = await userService.getOneByPhone(phone);

      if (checkUserEmail) {
        Result.error(res, { message: 'Email này đã tồn tại.' });
        return;
      }

      if (checkUserPhone) {
        Result.error(res, { message: 'Số điện thoại này đã tồn tại.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        firstName,
        lastName,
        phone,
        office,
        email,
        password: passwordHash,
      };

      const active_token = generateActiveToken({ newUser });
      const user1 = new userModel(newUser);

      const success = await userService.create(user1);

      Result.success(res, { message: 'Create Success!' });
    } catch (err: any) {
      return next(err);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      await userService.update(userId, req.body);
      Result.success(res, { message: 'Update Success!' });
    } catch (err: any) {
      return next(err);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const deletedUser = await userService.deleteOne(userId);
      Result.success(res, { message: 'Delete Success!', data: deletedUser });
    } catch (err: any) {
      return next(err);
    }
  },

  uploadUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file === undefined) {
        Result.error(res, { message: 'Vui lòng tải lên một tệp excel.' });
        return;
      }

      const usersList = await userService.upload(req.file.filename);
      Result.success(res, { message: 'Đã tải tệp lên thành công.', data: usersList });
    } catch (err: any) {
      return next(err);
    }
  },

  deleteManyUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedUsers = await userService.deleteMany(req.params.ids);
      Result.success(res, { message: `Xóa ${deletedUsers.deletedCount} tài khoản thành công.`, data: deletedUsers });
    } catch (err: any) {
      return next(err);
    }
  },
};

export default userController;
