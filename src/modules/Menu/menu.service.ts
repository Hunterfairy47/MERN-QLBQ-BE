import { Request, Response } from 'express';

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

const menuService = { getAll };

export default menuService;
