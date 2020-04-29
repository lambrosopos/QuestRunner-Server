import { Request, Response } from "express";
import { OK, BAD_REQUEST, NOT_FOUND, CREATED } from "http-status-codes";
import { User, UserDocument } from "../models/Users";

export default {
  get: async (req: Request, res: Response) => {
    const doc_id = req.user.user;

    User.findOne({ _id: doc_id }, (err: Error, doc: UserDocument) => {
      if (err) return res.sendStatus(NOT_FOUND);
      if (!doc) {
        return res.status(NOT_FOUND).json({ message: "user doesn't exist" });
      } else {
        return res.status(OK).json(doc);
      }
    });
  },
  post: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const tempUser = {
      username,
      email,
      password,
    };

    User.findOne({ "user.email": email }, (err: Error, doc: UserDocument) => {
      if (err) res.sendStatus(BAD_REQUEST);
      if (!doc) {
        User.create({ user: tempUser }, (err: Error, user: UserDocument) => {
          if (err) return res.status(BAD_REQUEST).send(err);
          res.status(CREATED).json({ message: "successfully added" });
        });
      } else {
        res.status(302).json({ message: "user already exists" });
      }
    });
  },
  patch: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
