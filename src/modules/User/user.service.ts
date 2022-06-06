import path from 'path';
import readXlsxFile from 'read-excel-file/node';
import { IUser } from '../../config/interface';
import userModel from './user.model';

const getAll = async ({ _page = 0, _limit = 0, _q = '', _order = '', _sort = '', _gender = '', _position = '' }) => {
  try {
    let aggregate_options = [];
    let search = !!_q;
    let gender = !!_gender;
    let position = !!_position;
    let match_regex = { $regex: _q, $options: 'i' };

    //FILTERING AND PARTIAL TEXT SEARCH
    if (search) {
      aggregate_options.push({
        $match: {
          $or: [{ _id: match_regex }, { name: match_regex }],
        },
      });
    }

    if (gender) {
      aggregate_options.push({
        $match: {
          gender: _gender,
        },
      });
    }

    if (position) {
      aggregate_options.push({
        $match: {
          position: _position,
        },
      });
    }

    //SORTING
    let sort_order = _order && _order === 'asc' ? 1 : -1;
    let sort_by = _sort || '_id';
    aggregate_options.push({
      $sort: {
        [sort_by as string]: sort_order,
      },
    });

    //PAGINATION
    let totalRows = await userModel.countDocuments();
    let page = !!_page ? +_page : 1;
    let limit = !!_limit ? +_limit : totalRows;
    aggregate_options.push({ $skip: (page - 1) * limit }, { $limit: limit });

    //Set up the aggregation
    let users = await userModel.aggregate(aggregate_options);

    return { users, pagination: { _page: page, _limit: limit, _totalRows: totalRows } };
  } catch (error) {
    throw error;
  }
};

const getOne = async (userId: string) => {
  try {
    const user = await userModel.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

const getOneByEmail = async (email: string) => {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    throw error;
  }
};

const getOneByPhone = async (phone: string) => {
  try {
    const user = await userModel.findOne({ phone });
    return user;
  } catch (error) {
    throw error;
  }
};

const create = async (data: IUser) => {
  try {
    const newUser = await userModel.create(data);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const update = async (userId: string, data: IUser) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, { $set: data }).lean();
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (userId: string) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(userId).lean();
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

const deleteMany = async (userIds: string) => {
  try {
    const ids = userIds.split(',');
    const deletedStaffs = await userModel.deleteMany({ _id: { $in: ids } });
    return deletedStaffs;
  } catch (error) {
    throw error;
  }
};

const upload = async (filename: string) => {
  try {
    console.log(filename);

    let fileExcel = path.resolve(__dirname, '../../resources/static/users/uploads/' + filename);
    readXlsxFile(fileExcel).then(async (rows) => {
      rows.shift();
      let users: IUser[] = [];
      for (const row of rows) {
        let user = new userModel({
          _id: row[1],
          lastName: row[2],
          firstName: row[3],
          gender: row[4],
          phone: row[5],
          email: row[6],
          position: row[7],
        });
        users.push(user);
      }
      const usersList = await userModel.create(users);
      return usersList;
    });
  } catch (error) {
    throw error;
  }
};

// const download = async () => {
//   const staffs = await userModel.find({}).sort({ _id: -1 });
//   let staffsList: any[] = [];
//   staffs.forEach((item, index) => {
//     let staff = {
//       STT: index + 1,
//       'Mã nhân viên': item._id,
//       'Họ lót nhân viên': item.lastName,
//       'Tên nhân viên': item.firstName,
//       'Giới tính': item.gender,
//       'Số điện thoại': item.phone,
//       'Địa chỉ email': item.email,
//       'Chức vụ': item.position,
//     };
//     staffsList.push(staff);
//   });
//   return staffsList;
// };

const userService = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
  deleteMany,
  upload,
  //   download,
  getOneByEmail,
  getOneByPhone,
};

export default userService;
