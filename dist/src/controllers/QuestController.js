"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
exports.default = {
    get: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
    post: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
    put: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
    putChecked: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
    putFinalize: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
};
//# sourceMappingURL=QuestController.js.map