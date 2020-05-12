"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Users_1 = require("@models/Users");
exports.default = {
    retrieveQuests: (req, res) => {
        const userID = req.user.uid;
        Users_1.User.findById(userID, { _id: 1, quests: 1 }, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ success: false, message: 'MongoDB Error' });
            if (doc) {
                return res.status(http_status_codes_1.OK).json({
                    success: true,
                    message: 'Found data',
                    _id: doc._id,
                    quests: doc.quests,
                });
            }
            else {
                return res
                    .status(http_status_codes_1.OK)
                    .json({ success: false, message: 'Data not found' });
            }
        });
    },
    addQuest: (req, res) => {
        const userID = req.user.uid;
        const questID = String(Date.now());
        const newQuest = {
            _id: questID,
            title: req.body.title,
            contents: req.body.content,
            created_at: req.body.created_at,
            due_date: req.body.due_date,
            checked: false,
            finalize: false,
        };
        Users_1.User.findByIdAndUpdate(userID, {
            $push: {
                quests: newQuest,
            },
        }, {
            new: true,
        }, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ success: false, message: 'MongoDB Error' });
            if (doc) {
                return res
                    .status(http_status_codes_1.OK)
                    .json({ success: true, message: 'Added new Quest' });
            }
            else {
                return res
                    .status(http_status_codes_1.NOT_FOUND)
                    .json({ success: false, message: 'Data not found' });
            }
        });
    },
    updateQuest: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
    putChecked: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
    putFinalize: (req, res) => {
        return res.status(http_status_codes_1.OK).end();
    },
};
