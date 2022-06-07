import { ITrainingLevel } from '../../config/interface';
import trainingModel from './training.model';

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
    let totalRows = await trainingModel.countDocuments();
    let page = !!_page ? +_page : 1;
    let limit = !!_limit ? +_limit : totalRows;
    aggregate_options.push({ $skip: (page - 1) * limit }, { $limit: limit });

    //Set up the aggregation
    let trainings = await trainingModel.aggregate(aggregate_options);
    let newTrainings: ITrainingLevel[] = [];
    trainings.forEach((training) => {
      if (training.trainingId === 'MN') {
        newTrainings.push(training);
      } else {
        let newTraining = { ...training, trainingName: training.trainingId };
        newTrainings.push(newTraining);
      }
    });

    return { newTrainings, pagination: { _page: page, _limit: limit, _totalRows: totalRows } };
  } catch (error) {
    throw error;
  }
};

const getOne = async (trainingId: string) => {
  try {
    const training = await trainingModel.findById(trainingId);
    return training;
  } catch (error) {
    throw error;
  }
};

const update = async (trainingId: string, data: ITrainingLevel) => {
  try {
    const updatedTraining = await trainingModel.findByIdAndUpdate(trainingId, { $set: data }).lean();
    return updatedTraining;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (trainingId: string) => {
  try {
    const deletedTraining = await trainingModel.findByIdAndDelete(trainingId).lean();
    return deletedTraining;
  } catch (error) {
    throw error;
  }
};

const trainingService = {
  getAll,
  getOne,
  deleteOne,
  update,
};

export default trainingService;
