"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers/");
const jwtAuthenticator_1 = require("../middlewares/jwtAuthenticator");
const router = express_1.Router();
router.post('/', _controllers_1.UserController.signup);
router.patch('/', jwtAuthenticator_1.authenticateJWT, _controllers_1.UserController.modify);
module.exports = router;
//# sourceMappingURL=UserRouter.js.map