import { Request, Response } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { User, UserDocument } from '@models/Users';

export default {
  topRanks: async (req: Request, res: Response) => {
    const rankLimit = Number(req.query.top);

    const queryResults = await User.find(
      {},
      { username: 1, profilePic: 1, motto: 1, experience: 1 }
    )
      .sort({ experience: -1 })
      .limit(rankLimit);

    return res.status(OK).json(queryResults);
  },
  myRank: async (req: Request, res: Response) => {
    const userID = req.user.uid;

    let queryResults: any = await User.find(
      {},
      {
        experience: 1,
        username: 1,
      }
    ).sort({ experience: -1 });

    let refinedResults = await Array.prototype.reduce.call(
      queryResults,
      (acc: any, curr: any, currIdx: number) => {
        if (String(curr._id) === userID) {
          return {
            username: curr.username,
            rank: currIdx,
          };
        } else {
          return acc;
        }
      },
      null
    );

    if (refinedResults) {
      return res.status(OK).json(refinedResults);
    } else {
      return res
        .status(NOT_FOUND)
        .json({ success: false, message: 'User has no rank' });
    }
  },
};
