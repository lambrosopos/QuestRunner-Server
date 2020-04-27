import { Router } from "express";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/user", require("./UserRouter"));
router.use("/userinfo", require("./UserInfoRouter"));
router.use("/avatar", require("./AvatarRouter"));
router.use("/quest", require("./QuestRouter"));
router.use("/rank", require("./RankRouter"));
router.use("/items", require("./ItemsRouter"));

// Export the base-router
export default router;
