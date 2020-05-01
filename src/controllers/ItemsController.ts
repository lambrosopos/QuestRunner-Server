import { Request, Response } from "express";
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  CREATED,
} from "http-status-codes";
import { User, UserDocument } from "@models/Users";
import { Item, ItemDocument } from "@models/Items";
import UserDao from "@daos/User/UserDao";

export default {
  getMyItems: (req: Request, res: Response) => {
    const id = req.user.uid;
    User.findById(id, (err: any, doc: UserDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);

      if (doc) {
        return res.status(OK).json({
          user: { active: doc.active },
          items: doc.items,
        });
      } else {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
    });
  },
  getStoreItems: (req: Request, res: Response) => {
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
  postPurchaseItem: async (req: Request, res: Response) => {
    const itemID = req.query.id;
    const item = await Item.findById(itemID, (err: any, doc: ItemDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);
      if (doc) {
        return doc;
      } else {
        return res
          .status(BAD_REQUEST)
          .json({ message: "No item with id found" });
      }
    });

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
          return res.status(NOT_FOUND).json({ message: "user id not found" });
        }
      }
    );
  },
  postActivateItem: async (req: Request, res: Response) => {
    const itemID = req.query.id;
    const item = await Item.findById(itemID, (err: any, doc: ItemDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);
      return doc;
    });

    const userID = req.user.uid;
    User.findByIdAndUpdate(
      userID,
      {
        $set: {
          [`active.${item?.category}`]: item,
        },
      },
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
            .json({ message: "user id not found" });
        }
      }
    );
  },
  postAddItem: (req: Request, res: Response) => {
    const itemToAdd = new Item(req.body);
    const { feature, category } = req.body;
    Item.findOne({ feature, category }, (err: any, doc: ItemDocument) => {
      if (err) return res.status(BAD_REQUEST).send(err);
      if (doc) {
        return res.status(CONFLICT).json({ message: "Item already exists" });
      } else {
        itemToAdd.save((err: any) => {
          if (err) return res.status(500).send(err);
          return res.status(CREATED).json({ message: "Item added" });
        });
      }
    });
  },
};
