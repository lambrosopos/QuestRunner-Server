import { Router } from "express";
import { UserController } from "../controllers";
import { authenticateJWT } from "../middlewares/jwtAuthenticator";
const router = Router();

router.post("/", UserController.postSignup);
router.patch("/", authenticateJWT, UserController.patch);

module.exports = router;
