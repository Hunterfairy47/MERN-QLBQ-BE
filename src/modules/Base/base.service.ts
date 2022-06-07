import { IBase } from '../../config/interface';
import baseModel from './base.model';

const getAll = async ({ _page = 0, _limit = 0, _q = '', _order = '', _sort = '' }) => {
  try {
    let aggregate_options = [];
    let search = !!_q;

    let match_regex = { $regex: _q, $options: 'i' };

    //FILTERING AND PARTIAL TEXT SEARCH
    if (search) {
      aggregate_options.push({
        $match: {
          $or: [{ _id: match_regex }, { name: match_regex }],
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
    let totalRows = await baseModel.countDocuments();
    let page = !!_page ? +_page : 1;
    let limit = !!_limit ? +_limit : totalRows;
    aggregate_options.push({ $skip: (page - 1) * limit }, { $limit: limit });

    //Set up the aggregation
    let bases = await baseModel.aggregate(aggregate_options);

    return { bases, pagination: { _page: page, _limit: limit, _totalRows: totalRows } };
  } catch (error) {
    throw error;
  }
};

const getOne = async (baseId: string) => {
  try {
    const base = await baseModel.findById(baseId);
    return base;
  } catch (error) {
    throw error;
  }
};

const update = async (baseId: string, data: IBase) => {
  try {
    const updatedBase = await baseModel.findByIdAndUpdate(baseId, { $set: data }).lean();
    return updatedBase;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (baseId: string) => {
  try {
    const deletedBase = await baseModel.findByIdAndDelete(baseId).lean();
    return deletedBase;
  } catch (error) {
    throw error;
  }
};

const baseService = {
  getAll,
  getOne,
  deleteOne,
  update,
};

export default baseService;
