import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { User } from '@models/Users';

export default {
  get: async (req: Request, res: Response) => {
    const rankLimit: any = req.query.top;

    const queryResults = await User.find()
      .sort({ experience: -1 })
      .limit(rankLimit);

    return res.status(OK).end(queryResults);
  },
};
