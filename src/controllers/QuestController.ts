import { Request, Response } from "express";
import { OK } from "http-status-codes";

export default {
  get: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  post: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  put: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  putChecked: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  putFinalize: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
