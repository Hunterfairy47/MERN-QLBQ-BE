import excelJS from 'exceljs';
import { Request, Response } from 'express';
import moment from 'moment';
import path from 'path';
interface IngredientDishProps {
  realUnit: string;
  realMass: number;
  ingredient: Object;
}
interface MenuDetailProps {
  dishId: string;
  dishName: string;
  typeDishName: string;
  dishDetailId: string;
  ingredientdish: IngredientDishProps[];
}
interface DataExportProps {
  menuId: string;
  date: string;
  totalStudent: number;
  trainingLevelName: string;
  menuDetail: MenuDetailProps[];
}
const getAll = async (req: Request, res: Response) => {
  try {
    let aggregate_options = [];
    let search = !!req.query._q;
    let match_regex = { $regex: req.query._q, $options: 'i' };
    aggregate_options.push(
      {
        $lookup: {
          from: 'trainings',
          localField: 'trainingLevelId',
          foreignField: '_id',
          as: 'trainingLevel',
        },
      },
      {
        $unwind: '$trainingLevel',
      }
    );

    return aggregate_options;
  } catch (error) {
    throw error;
  }
};

const exportExcel = async (data: DataExportProps) => {
  const workbook = new excelJS.Workbook(); // Create a new workbook
  const worksheet = workbook.addWorksheet('Nguyên liệu'); // New Worksheet
  let excelFile = path.resolve(__dirname, '../../resources/static/menuDate/uploads/');
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
  const test = await workbook.xlsx.writeFile(
    `${excelFile}/menuDetail-${moment(data.date, 'DD/MM/YYYY').format('DD-MM-YYYY')}.xlsx`
  );
  return data;
};

const menuService = { getAll, exportExcel };

export default menuService;
