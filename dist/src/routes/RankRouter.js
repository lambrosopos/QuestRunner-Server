"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers/");
const router = express_1.Router();
router.get('/', _controllers_1.RankController.topRanks);
module.exports = router;
//# sourceMappingURL=RankRouter.js.map