import { Router } from "express";
import { RankController } from "@controllers/";
const router = Router();

router.get("/", RankController.get);

module.exports = router;
