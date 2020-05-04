import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes';
require('dotenv').config();

export const accessTokenExpiresIn = '1h';
export const refreshTokenExpiresIn = '1d';
export const accessTokenSecret = '@questRunner';
export const refreshTokenSecret = '@runDev';
export const refreshTokenList = new Array();

export const authenticateJWT = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const tokenToVerify = authHeader;

    jwt.verify(tokenToVerify, '@questRunner', (err: any, user: any) => {
      if (err) return res.sendStatus(UNAUTHORIZED);
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(UNAUTHORIZED).json({ message: 'token missing' });
  }
};
