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
const exceljs_1 = __importDefault(require("exceljs"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let aggregate_options = [];
        let search = !!req.query._q;
        let match_regex = { $regex: req.query._q, $options: 'i' };
        aggregate_options.push({
            $lookup: {
                from: 'trainings',
                localField: 'trainingLevelId',
                foreignField: '_id',
                as: 'trainingLevel',
            },
        }, {
            $unwind: '$trainingLevel',
        });
        return aggregate_options;
    }
    catch (error) {
        throw error;
    }
});
const exportExcel = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet('Nguyên liệu'); // New Worksheet
    let excelFile = path_1.default.resolve(__dirname, '../../resources/static/menuDate/uploads/');
    // const path = "./files";  // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [{ header: 'Tên nguyên liệu', key: data.date, width: 10 }];
    // Looping through User data
    data.menuDetail.forEach((item) => {
        worksheet.addRow(item); // Add data in worksheet
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    const test = yield workbook.xlsx.writeFile(`${excelFile}/menuDetail-${(0, moment_1.default)(data.date, 'DD/MM/YYYY').format('DD-MM-YYYY')}.xlsx`);
    console.log(test);
    return data;
});
const menuService = { getAll, exportExcel };
exports.default = menuService;
