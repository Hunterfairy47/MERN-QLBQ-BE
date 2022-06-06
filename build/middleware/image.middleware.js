"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer = require('multer');
const __baseDir = 'src/resources/static/dish/uploads';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __baseDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-qlba-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb('Type file does not support');
    }
};
exports.uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
}).single('file');
