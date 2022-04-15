import { Request } from 'express';

const multer = require('multer');

const __baseDir = 'src/resources/static/dish/uploads';
const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, __baseDir);
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, `${Date.now()}-qlba-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb('Type file does not support');
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('file');
