import { Router } from "express";
import { UserController } from "../controllers";
const router = Router();

router.post("/", UserController.post);
router.post("/", UserController.patch);

module.exports = router;
