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
  postPurchaseItem: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  postActivateItem: (req: Request, res: Response) => {
    return res.status(OK).end();
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
