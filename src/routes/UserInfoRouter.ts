import { Router } from "express";
import { UserInfoController } from "../controllers";

const router = Router();

router.post("/", UserInfoController.post);

module.exports = router;
