"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileExcel = void 0;
const multer_1 = __importDefault(require("multer"));
const DIR = 'src/resources/static/assets/uploads';
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const excelFilter = (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
        cb(null, true);
    }
    else {
        cb('Vui lòng chỉ tải lên tệp excel.', false);
    }
};
exports.uploadFileExcel = (0, multer_1.default)({
    storage: storage,
    fileFilter: excelFilter,
}).single('file');
