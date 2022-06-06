"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const node_1 = __importDefault(require("read-excel-file/node"));
const user_model_1 = __importDefault(require("./user.model"));
const getAll = ({ _page = 0, _limit = 0, _q = '', _order = '', _sort = '', _gender = '', _position = '' }) => __awaiter(void 0, void 0, void 0, function* () {
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
                [sort_by]: sort_order,
            },
        });
        //PAGINATION
        let totalRows = yield user_model_1.default.countDocuments();
        let page = !!_page ? +_page : 1;
        let limit = !!_limit ? +_limit : totalRows;
        aggregate_options.push({ $skip: (page - 1) * limit }, { $limit: limit });
        //Set up the aggregation
        let users = yield user_model_1.default.aggregate(aggregate_options);
        return { users, pagination: { _page: page, _limit: limit, _totalRows: totalRows } };
    }
    catch (error) {
        throw error;
    }
});
const getOne = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(userId);
        return user;
    }
    catch (error) {
        throw error;
    }
});
const getOneByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email });
        return user;
    }
    catch (error) {
        throw error;
    }
});
const getOneByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ phone });
        return user;
    }
    catch (error) {
        throw error;
    }
});
const create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield user_model_1.default.create(data);
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
const update = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { $set: data }).lean();
        return updatedUser;
    }
    catch (error) {
        throw error;
    }
});
const deleteOne = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield user_model_1.default.findByIdAndDelete(userId).lean();
        return deletedUser;
    }
    catch (error) {
        throw error;
    }
});
const deleteMany = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = userIds.split(',');
        const deletedStaffs = yield user_model_1.default.deleteMany({ _id: { $in: ids } });
        return deletedStaffs;
    }
    catch (error) {
        throw error;
    }
});
const upload = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let fileExcel = path_1.default.resolve(__dirname, '../../resources/static/users/uploads/' + filename);
        (0, node_1.default)(fileExcel).then((rows) => __awaiter(void 0, void 0, void 0, function* () {
            rows.shift();
            let users = [];
            for (const row of rows) {
                let user = new user_model_1.default({
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
            const usersList = yield user_model_1.default.create(users);
            return usersList;
        }));
    }
    catch (error) {
        throw error;
    }
});
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
exports.default = userService;
