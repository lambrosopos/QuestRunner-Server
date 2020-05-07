"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers/");
const router = express_1.Router();
router.post("/", _controllers_1.QuestController.post);
router.put("/", _controllers_1.QuestController.put);
router.put("/checked", _controllers_1.QuestController.putChecked);
router.put("/finalize", _controllers_1.QuestController.putFinalize);
module.exports = router;
//# sourceMappingURL=QuestRouter.js.map