import { Request, Response } from "express";
import { OK, BAD_REQUEST } from "http-status-codes";
import User from "../models/Users";

export default {
  get: async (req: Request, res: Response) => {
    User.find((error: Error, users: any) => {
      if (error) return res.sendStatus(BAD_REQUEST);
      return res.status(OK).json(users);
    });
  },
};
