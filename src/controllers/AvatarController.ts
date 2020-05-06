import { Request, Response } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { User, UserDocument } from '@models/Users';

export default {
  get: (req: Request, res: Response) => {
    const userID = req.user.uid;

    User.findById(userID, (err: any, doc: UserDocument) => {
      if (err)
        return res
          .status(BAD_REQUEST)
          .json({ message: 'DB error in finding ID' });
      if (doc) {
        return res
          .status(OK)
          .json({ messsage: 'Success', url: doc.profilePic });
      } else {
        return res.status(NOT_FOUND).json({ message: 'User not found' });
      }
    });
    return res.status(OK).end();
  },
  put: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
