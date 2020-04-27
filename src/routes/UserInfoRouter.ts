import { Router } from "express";
import { UserInfoController } from "../controllers";

const router = Router();

router.get("/", UserInfoController.get);

module.exports = router;
