import { Response } from 'express';

const Result = {
  success: (res: Response, data: []|{}, status = 200) => {
    return res.status(status).json({
      status: 'success',
      data,
    });
  },
  error: (res: Response, error: {}, status = 400) => {
    return res.status(status).json({
      status: 'failed',
      error,
    });
  },
};
export default Result;
