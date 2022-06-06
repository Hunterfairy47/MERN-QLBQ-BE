"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const __baseDir = 'src/resources/static/ingredients/uploads';
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __baseDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-qlba-${file.originalname}`);
    },
});
const excelFilter = (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
        cb(null, true);
    }
    else {
        cb('Chỉ tải lên file excel.', false);
    }
};
exports.uploadFile = (0, multer_1.default)({
    storage: storage,
    fileFilter: excelFilter,
}).single('file');
