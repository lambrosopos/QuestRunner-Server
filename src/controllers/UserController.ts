import { Request, Response } from "express";
import {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  CREATED,
  UNAUTHORIZED,
} from "http-status-codes";
import { User, UserDocument } from "../models/Users";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  accessTokenSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  refreshTokenSecret,
  refreshTokenList,
} from "../middlewares/jwtAuthenticator";

export default {
  get: async (req: Request, res: Response) => {
    const doc_id = req.user.uid;

    User.findOne({ _id: doc_id }, (err: Error, doc: UserDocument) => {
      if (err) return res.sendStatus(NOT_FOUND);
      if (!doc) {
        return res.status(NOT_FOUND).json({ message: "user doesn't exist" });
      } else {
        return res.status(OK).json(doc);
      }
    });
  },
  postSignin: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    User.findOne({ email }, async (err: any, doc: any) => {
      if (err) return res.sendStatus(BAD_REQUEST);
      if (!doc) {
        return res.status(NOT_FOUND).json({ message: "user doesn't exist" });
      } else {
        bcrypt.compare(password, doc.password, (err, result) => {
          if (err) return res.status(BAD_REQUEST).send(err);
          if (result) {
            const id = doc["_id"];

            const accessToken = jwt.sign({ uid: id }, accessTokenSecret, {
              expiresIn: accessTokenExpiresIn,
            });

            const refreshToken = jwt.sign({ uid: id }, refreshTokenSecret, {
              expiresIn: refreshTokenExpiresIn,
            });

            refreshTokenList.push(refreshToken);

            return res.status(OK).json({ accessToken, refreshToken });
          } else {
            return res.status(UNAUTHORIZED).json({ message: "wrong password" });
          }
        });
      }
    });
  },
  postSignup: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    let user = new User({
      username,
      email,
      password,
    });

    User.findOne({ email }, (err: mongoose.Error, doc: UserDocument) => {
      if (err) return res.sendStatus(BAD_REQUEST);
      if (!doc) {
        user.save((err) => {
          if (err) return res.status(302).send(err);
          return res.status(CREATED).json({ message: "successfully added" });
        });
      } else {
        return res.status(302).json({ message: "user already exists" });
      }
    });
  },
  patch: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
