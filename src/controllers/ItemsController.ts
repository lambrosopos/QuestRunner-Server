import { Request, Response } from "express";
import { OK } from "http-status-codes";

export default {
  getMyItems: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  getStoreItems: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  postPurchaseItem: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
  postActivateItem: (req: Request, res: Response) => {
    return res.status(OK).end();
  },
};
