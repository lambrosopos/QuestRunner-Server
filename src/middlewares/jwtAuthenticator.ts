import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED, BAD_REQUEST } from "http-status-codes";
require("dotenv").config();

export const accessTokenExpiresIn = "1h";
export const refreshTokenExpiresIn = "1d";
export const accessTokenSecret = "@questRunner";
export const refreshTokenSecret = "@runDev";
export const refreshTokenList = new Array();

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const tokenToVerify = authHeader;

    jwt.verify(tokenToVerify, "@questRunner", (err, user) => {
      if (err) return res.sendStatus(UNAUTHORIZED);

      req.body = user;
      next();
    });
  } else {
    return res.sendStatus(BAD_REQUEST);
  }
};
