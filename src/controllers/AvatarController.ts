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
          .json({ sucesss: true, messsage: 'Found user', url: doc.profilePic });
      } else {
        return res
          .status(NOT_FOUND)
          .json({ success: false, message: 'User not found' });
      }
    });
  },
  put: (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ message: 'No file attached' });
    } else {
      const finalImg = {
        original_name: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer,
        size: req.file.size,
      };
      console.log(finalImg);
      return res.status(OK).json({ success: true, message: 'saved to s3' });
    }
  },
};
