"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const Users_1 = require("@models/Users");
exports.default = {
    topRanks: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const rankLimit = Number(req.query.top);
        const queryResults = yield Users_1.User.find({}, { username: 1, profilePic: 1, motto: 1, experience: 1 })
            .sort({ experience: -1 })
            .limit(rankLimit);
        return res.status(http_status_codes_1.OK).json(queryResults);
    }),
    myRank: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const userID = req.user.uid;
        let queryResults = yield Users_1.User.find({}, {
            experience: 1,
            username: 1,
        }).sort({ experience: -1 });
        let refinedResults = yield Array.prototype.reduce.call(queryResults, (acc, curr, currIdx) => {
            if (String(curr._id) === userID) {
                return {
                    username: curr.username,
                    rank: currIdx,
                };
            }
            else {
                return acc;
            }
        }, null);
        if (refinedResults) {
            return res.status(http_status_codes_1.OK).json(refinedResults);
        }
        else {
            return res
                .status(http_status_codes_1.NOT_FOUND)
                .json({ success: false, message: 'User has no rank' });
        }
    }),
};
