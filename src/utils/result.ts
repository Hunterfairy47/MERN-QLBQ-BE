import { Response } from 'express';

const Result = {
  success: (res: Response, data: any, status = 200) => {
    return res.status(status).json(data);
  },
  error: (res: Response, error: {}, status = 400) => {
    return res.status(status).json({
      status: 'failed',
      error,
    });
  },
};
export default Result;
