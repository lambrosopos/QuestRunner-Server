"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
require('dotenv').config();
exports.accessTokenExpiresIn = '1h';
exports.refreshTokenExpiresIn = '1d';
exports.accessTokenSecret = '@questRunner';
exports.refreshTokenSecret = '@runDev';
exports.refreshTokenList = new Array();
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const tokenToVerify = authHeader;
        jsonwebtoken_1.default.verify(tokenToVerify, '@questRunner', (err, user) => {
            if (err)
                return res.sendStatus(http_status_codes_1.UNAUTHORIZED);
            req.user = user;
            next();
        });
    }
    else {
        return res.sendStatus(http_status_codes_1.UNAUTHORIZED).json({ message: 'token missing' });
    }
};
//# sourceMappingURL=jwtAuthenticator.js.map