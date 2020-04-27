import { Request, Response } from "express";
import { OK } from "http-status-codes";

export default {
  get: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
