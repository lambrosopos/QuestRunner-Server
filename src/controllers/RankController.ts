import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { User } from '@models/Users';

export default {
  get: async (req: Request, res: Response) => {
    const rankLimit = Number(req.query.top);

    const queryResults = await User.find(
      {},
      { username: 1, profilePic: 1, motto: 1, experience: 1 }
    )
      .sort({ experience: -1 })
      .limit(rankLimit);

    return res.status(OK).json(queryResults);
  },
};
