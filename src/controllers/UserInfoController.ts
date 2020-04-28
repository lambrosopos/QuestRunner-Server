import { Request, Response } from "express";
import { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "http-status-codes";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import {
  accessTokenSecret,
  refreshTokenList,
  refreshTokenSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} from "../middlewares/jwtAuthenticator";

require("dotenv").config();

export default {
  post: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    User.findOne({ "user.email": email }, (err: any, doc: any) => {
      if (err) return res.sendStatus(BAD_REQUEST);
      if (!doc) {
        return res.status(NOT_FOUND).json({ message: "user doesn't exist" });
      } else {
        if (doc.user.password === password) {
          const id = doc["_id"];

          const accessToken = jwt.sign({ user: id }, accessTokenSecret, {
            expiresIn: accessTokenExpiresIn,
          });

          const refreshToken = jwt.sign({ user: id }, refreshTokenSecret, {
            expiresIn: refreshTokenExpiresIn,
          });

          refreshTokenList.push(refreshToken);

          return res.status(OK).json({ accessToken, refreshToken });
        } else {
          return res.status(UNAUTHORIZED).json({ message: "wrong password" });
        }
      }
    });
  },
};
