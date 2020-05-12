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
    const userID = req.user.uid;
    const update: {
      title?: string;
      contents?: string;
    } = {};

    if (req.body.title) update['title'] = req.body.title;
    if (req.body.content) update['contents'] = req.body.content;

    const questID = req.query.id;

    User.findByIdAndUpdate(
      userID,
      {
        $set: {
          'quests.$[elem].title': update.title || '',
          'quests.$[elem].contents': update.contents,
        },
      },
      {
        arrayFilters: [{ 'elem._id': questID }],
        new: true,
      },
      (err: any, doc: any) => {
        if (err)
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'MongoDB Error' });

        if (doc) {
          return res.status(OK).json({
            success: true,
            message: 'Updated Quest',
            quest:
              doc.quests.filter((q: any) => q._id === questID)[0] ||
              'Quest ID not found',
          });
        } else {
          return res
            .status(NOT_FOUND)
            .json({ success: false, message: 'Data not found' });
        }
      }
    );
  },
  checkedOrFinal: async (req: Request, res: Response) => {
    const userID = req.user.uid;
    const questID = String(req.query.id);

    const currentQuest = await User.findOne(
      { _id: userID },
      { quests: 1, _id: 1 },
      (err: any, doc: any) => {
        if (err)
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'MongoDB Error' });

        if (doc) {
          const queriedQuest = doc.quests.filter(
            (q: any) => q._id === questID
          )[0];

          console.log('======================================');
          console.log('Queried Quest');
          console.log(queriedQuest);
          console.log('======================================');

          const isChecked = req.query.checked || queriedQuest.checked;
          const isFinalized = req.query.finalize || queriedQuest.finalize;

          User.findOneAndUpdate(
            { _id: userID },
            {
              $set: {
                'quests.$[elem].checked': isChecked,
                'quests.$[elem].finalize': isFinalized,
              },
            },
            {
              new: true,
              arrayFilters: [{ 'elem._id': questID }],
            },
            (err: any, doc: any) => {
              if (err)
                return res
                  .status(BAD_REQUEST)
                  .json({ success: false, message: 'MongoDB Error' });

              if (doc) {
                const updatedQuest = doc.quests.filter(
                  (q: any) => q._id === questID
                )[0];
                console.log('======================================');
                console.log('Changed Quest');
                console.log(updatedQuest);
                console.log('======================================');
                return res.status(OK).json({
                  success: true,
                  message: 'Updated Checked Finalized Quest',
                  quest: updatedQuest || 'Quest ID not found',
                });
              } else {
                return res
                  .status(NOT_FOUND)
                  .json({ success: false, message: 'Data not found' });
              }
            }
          );
        } else {
          return res
            .status(NOT_FOUND)
            .json({ success: false, message: 'Data not found' });
        }
      }
    );
  },
  deleteQuest: (req: Request, res: Response) => {
    const userID = req.user.uid;
    const questID = String(req.query.id);

    User.findOneAndUpdate(
      { _id: userID },
      {
        $pull: { quests: { _id: questID } },
      },
      { new: true },
      (err: any, doc: any) => {
        if (err)
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'MongoDB Error' });

        if (doc) {
          return res.status(OK).json({
            success: true,
            message: 'Deleted Quest',
          });
        } else {
          return res
            .status(NOT_FOUND)
            .json({ success: false, message: 'Data not found' });
        }
      }
    );
  },
};
