import { Request, Response } from 'express';
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  CREATED,
} from 'http-status-codes';
import { User, UserDocument } from '@models/Users';
import { Item, ItemDocument } from '@models/Items';
import { any } from 'bluebird';

export default {
  myItems: (req: Request, res: Response) => {
    const id = req.user.uid;
    User.findById(id, (err: any, doc: UserDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);

      if (doc) {
        return res.status(OK).json({
          user: { active: doc.active },
          items: doc.items,
        });
      } else {
        return res.status(NOT_FOUND).json({ message: 'User not found' });
      }
    });
  },
  store: (req: Request, res: Response) => {
    Item.find((err: any, doc: any) => {
      const sortedDoc = doc.reduce(
        (acc: any, curr: ItemDocument) => ({
          ...acc,
          [curr.category]: acc[curr.category]
            ? [...acc[curr.category], curr]
            : [curr],
        }),
        {}
      );
      return res.status(OK).json(sortedDoc);
    });
  },
  purchase: async (req: Request, res: Response) => {
    const itemID = req.query.id;
    const item = await Item.findById(itemID, (err: any, doc: ItemDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);
      if (doc) {
        return doc;
      } else {
        return res
          .status(BAD_REQUEST)
          .json({ message: 'No item with id found' });
      }
    });

    console.log('item');
    console.log(item);

    const userID = req.user.uid;
    User.findOneAndUpdate(
      { _id: userID },
      {
        $inc: { credits: item ? -item.price : 0 },
        $push: { [`items.${item?.category}`]: item },
      },
      { new: true },
      (err: any, doc: any) => {
        if (err) return res.status(BAD_REQUEST).send(err);
        if (doc) {
          return res.sendStatus(OK);
        } else {
          return res.status(NOT_FOUND).json({ message: 'user id not found' });
        }
      }
    );
  },
  activate: async (req: Request, res: Response) => {
    const itemID = req.query.id;
    const item = await Item.findById(itemID, (err: any, doc: ItemDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);
      return doc;
    });

    let featureToSet: any = {};

    featureToSet['$set'] = {
      [`active.${item?.category}`]: item,
    };

    const userID = req.user.uid;
    User.findByIdAndUpdate(
      userID,
      featureToSet,
      {
        new: true,
      },
      (err: any, doc: any) => {
        if (err) return res.status(BAD_REQUEST).send(err);
        if (doc) {
          return res.sendStatus(OK);
        } else {
          return res
            .sendStatus(NOT_FOUND)
            .json({ message: 'user id not found' });
        }
      }
    );
  },
  add: (req: Request, res: Response) => {
    const itemToAdd = new Item(req.body);
    const { item_name, category } = req.body;
    Item.findOne({ item_name, category }, (err: any, doc: ItemDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);
      if (doc) {
        return res.status(CONFLICT).json({ message: 'Item already exists' });
      } else {
        itemToAdd.save((err: any) => {
          if (err) return res.status(500).send(err);
          return res.status(CREATED).json({ message: 'Item added' });
        });
      }
    });
  },
  modify: (req: Request, res: Response) => {
    const itemToChange = req.body;
    const itemID = req.query.id;
    console.log(itemToChange);

    Item.findByIdAndUpdate(itemID, itemToChange, (err: any, doc: any) => {
      if (err)
        return res
          .status(BAD_REQUEST)
          .json({ message: 'DB error while updating' });
      if (doc) {
        console.log('Updated Document');
        return res
          .status(OK)
          .json({ success: true, message: 'successfully updated' });
      } else {
        console.log('No document found');
        return res
          .status(OK)
          .json({ success: true, message: 'Item not found' });
      }
    });
  },
  darkmode: (req: Request, res: Response) => {
    const userID = req.user.uid;
    const isDarkmode = req.query.dark === 'true' ? true : false;

    User.findOneAndUpdate(
      { _id: userID },
      {
        $set: {
          darkmode: isDarkmode,
        },
      },
      { new: true },
      (err: any, doc: any) => {
        if (err) {
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'MongoDB error', err });
        }

        if (doc) {
          return res.status(OK).json({
            success: true,
            message: 'Data updated',
            darkmode: doc.darkmode,
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
