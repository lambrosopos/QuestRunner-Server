import { Request, Response } from "express";
import { OK } from "http-status-codes";

export default {
  post: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  patch: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
