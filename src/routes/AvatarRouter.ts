import { Router } from "express";
import { AvatarController } from "../controllers";

const router = Router();

router.get("/", AvatarController.get);
router.put("/", AvatarController.put);

module.exports = router;
