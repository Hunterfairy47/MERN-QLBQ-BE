import { Request } from 'express';
import multer from 'multer';

const __baseDir = 'src/resources/static/ingredients/uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __baseDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-qlba-${file.originalname}`);
  },
});

const excelFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
    cb(null, true);
  } else {
    cb('Chỉ tải lên file excel.', false);
  }
};

export const uploadFile = multer({
  storage: storage,
  fileFilter: excelFilter,
}).single('file');
