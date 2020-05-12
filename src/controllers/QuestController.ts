import { Request, Response } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { User, UserDocument } from '@models/Users';
// const uuidv4 = require('uuid/v4');

export default {
  retrieveQuests: (req: Request, res: Response) => {
    const userID = req.user.uid;

    User.findById(
      userID,
      { _id: 1, quests: 1 },
      (err: any, doc: UserDocument) => {
        if (err)
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'MongoDB Error' });

        if (doc) {
          return res.status(OK).json({
            success: true,
            message: 'Found data',
            _id: doc._id,
            quests: doc.quests,
          });
        } else {
          return res
            .status(OK)
            .json({ success: false, message: 'Data not found' });
        }
      }
    );
  },
  addQuest: (req: Request, res: Response) => {
    const userID = req.user.uid;
    const questID = String(Date.now());

    const newQuest = {
      _id: questID,
      title: req.body.title,
      contents: req.body.content,
      created_at: req.body.created_at,
      due_date: req.body.due_date,
      checked: false,
      finalize: false,
    };

    User.findByIdAndUpdate(
      userID,
      {
        $push: {
          quests: newQuest,
        },
      },
      {
        new: true,
      },
      (err: any, doc: any) => {
        if (err)
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'MongoDB Error' });

        if (doc) {
          return res
            .status(OK)
            .json({ success: true, message: 'Added new Quest' });
        } else {
          return res
            .status(NOT_FOUND)
            .json({ success: false, message: 'Data not found' });
        }
      }
    );
  },
  updateQuest: (req: Request, res: Response) => {
    // const userID = req.user.uid;
    // const questID = req.query.id;
    // const update: {
    //   title?: string;
    //   contents?: string;
    // } = {};

    // if (req.body.title) update['title'] = req.body.title;
    // if (req.body.content) update['contents'] = req.body.content;

    // User.findByIdAndUpdate(userID, {
    //   $set: {
    //     quests: [],
    //   },
    // });
    return res.status(OK).end();
  },
  putChecked: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  putFinalize: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
