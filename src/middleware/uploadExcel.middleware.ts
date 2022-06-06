import { Request } from 'express';
import multer from 'multer';

const DIR = 'src/resources/static/assets/uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const excelFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
    cb(null, true);
  } else {
    cb('Vui lòng chỉ tải lên tệp excel.', false);
  }
};

export const uploadFileExcel = multer({
  storage: storage,
  fileFilter: excelFilter,
}).single('file');
