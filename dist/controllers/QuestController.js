"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
        const userID = req.user.uid;
        const update = {};
        if (req.body.title)
            update['title'] = req.body.title;
        if (req.body.content)
            update['contents'] = req.body.content;
        const questID = req.query.id;
        Users_1.User.findByIdAndUpdate(userID, {
            $set: {
                'quests.$[elem].title': update.title || '',
                'quests.$[elem].contents': update.contents,
            },
        }, {
            arrayFilters: [{ 'elem._id': questID }],
            new: true,
        }, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ success: false, message: 'MongoDB Error' });
            if (doc) {
                return res.status(http_status_codes_1.OK).json({
                    success: true,
                    message: 'Updated Quest',
                    quest: doc.quests.filter((q) => q._id === questID)[0] ||
                        'Quest ID not found',
                });
            }
            else {
                return res
                    .status(http_status_codes_1.NOT_FOUND)
                    .json({ success: false, message: 'Data not found' });
            }
        });
    },
    checkedOrFinal: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const userID = req.user.uid;
        const questID = String(req.query.id);
        const currentQuest = yield Users_1.User.findOne({ _id: userID }, { quests: 1, _id: 1 }, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ success: false, message: 'MongoDB Error' });
            if (doc) {
                const queriedQuest = doc.quests.filter((q) => q._id === questID)[0];
                console.log('======================================');
                console.log('Queried Quest');
                console.log(queriedQuest);
                console.log('======================================');
                const isChecked = req.query.checked || queriedQuest.checked;
                const isFinalized = req.query.finalize || queriedQuest.finalize;
                Users_1.User.findOneAndUpdate({ _id: userID }, {
                    $set: {
                        'quests.$[elem].checked': isChecked,
                        'quests.$[elem].finalize': isFinalized,
                    },
                }, {
                    new: true,
                    arrayFilters: [{ 'elem._id': questID }],
                }, (err, doc) => {
                    if (err)
                        return res
                            .status(http_status_codes_1.BAD_REQUEST)
                            .json({ success: false, message: 'MongoDB Error' });
                    if (doc) {
                        const updatedQuest = doc.quests.filter((q) => q._id === questID)[0];
                        console.log('======================================');
                        console.log('Changed Quest');
                        console.log(updatedQuest);
                        console.log('======================================');
                        return res.status(http_status_codes_1.OK).json({
                            success: true,
                            message: 'Updated Checked Finalized Quest',
                            quest: updatedQuest || 'Quest ID not found',
                        });
                    }
                    else {
                        return res
                            .status(http_status_codes_1.NOT_FOUND)
                            .json({ success: false, message: 'Data not found' });
                    }
                });
            }
            else {
                return res
                    .status(http_status_codes_1.NOT_FOUND)
                    .json({ success: false, message: 'Data not found' });
            }
        });
    }),
    deleteQuest: (req, res) => {
        const userID = req.user.uid;
        const questID = String(req.query.id);
        Users_1.User.findOneAndUpdate({ _id: userID }, {
            $pull: { quests: { _id: questID } },
        }, { new: true }, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ success: false, message: 'MongoDB Error' });
            if (doc) {
                return res.status(http_status_codes_1.OK).json({
                    success: true,
                    message: 'Deleted Quest',
                });
            }
            else {
                return res
                    .status(http_status_codes_1.NOT_FOUND)
                    .json({ success: false, message: 'Data not found' });
            }
        });
    },
};
