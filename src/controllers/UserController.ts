import { Request, Response } from "express";
import { OK, BAD_REQUEST, NOT_FOUND, CREATED } from "http-status-codes";
import User from "../models/Users";

export default {
  post: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const tempUser = {
      username,
      email,
      password,
    };

    User.findOne({ "user.email": email }, (err: Error, doc: any) => {
      if (err) res.sendStatus(BAD_REQUEST);
      if (!doc) {
        User.create({ user: tempUser }, (err: Error, user: any) => {
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
