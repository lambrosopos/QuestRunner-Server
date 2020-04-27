import { Router } from "express";

// For simple get routes
import { QuestController } from "../controllers";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/user", require("./UserRouter"));
router.use("/userinfo", require("./UserInfoRouter"));
router.use("/avatar", require("./AvatarRouter"));
router.use("/quest", require("./QuestRouter"));
router.use("/rank", require("./RankRouter"));
router.use("/items", require("./ItemsRouter"));

// Adding simple get routes
router.get("/quests", QuestController.get);

// Export the base-router
export default router;
