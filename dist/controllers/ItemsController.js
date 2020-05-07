"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const Users_1 = require("@models/Users");
const Items_1 = require("@models/Items");
exports.default = {
    myItems: (req, res) => {
        const id = req.user.uid;
        Users_1.User.findById(id, (err, doc) => {
            if (err)
                return res.status(http_status_codes_1.BAD_REQUEST).send(err);
            if (doc) {
                return res.status(http_status_codes_1.OK).json({
                    user: { active: doc.active },
                    items: doc.items,
                });
            }
            else {
                return res.status(http_status_codes_1.NOT_FOUND).json({ message: 'User not found' });
            }
        });
    },
    store: (req, res) => {
        Items_1.Item.find((err, doc) => {
            const sortedDoc = doc.reduce((acc, curr) => (Object.assign(Object.assign({}, acc), { [curr.category]: acc[curr.category]
                    ? [...acc[curr.category], curr]
                    : [curr] })), {});
            return res.status(http_status_codes_1.OK).json(sortedDoc);
        });
    },
    purchase: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const itemID = req.query.id;
        const item = yield Items_1.Item.findById(itemID, (err, doc) => {
            if (err)
                return res.status(http_status_codes_1.BAD_REQUEST).send(err);
            if (doc) {
                return doc;
            }
            else {
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ message: 'No item with id found' });
            }
        });
        const userID = req.user.uid;
        Users_1.User.findOneAndUpdate({ _id: userID }, {
            $inc: { credits: item ? -item.price : 0 },
            $push: { [`items.${item === null || item === void 0 ? void 0 : item.category}`]: item },
        }, { new: true }, (err, doc) => {
            if (err)
                return res.status(http_status_codes_1.BAD_REQUEST).send(err);
            if (doc) {
                return res.sendStatus(http_status_codes_1.OK);
            }
            else {
                return res.status(http_status_codes_1.NOT_FOUND).json({ message: 'user id not found' });
            }
        });
    }),
    activate: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const itemID = req.query.id;
        const item = yield Items_1.Item.findById(itemID, (err, doc) => {
            if (err)
                return res.status(http_status_codes_1.BAD_REQUEST).send(err);
            return doc;
        });
        const userID = req.user.uid;
        Users_1.User.findByIdAndUpdate(userID, {
            $set: {
                [`active.${item === null || item === void 0 ? void 0 : item.category}`]: item,
            },
        }, {
            new: true,
        }, (err, doc) => {
            if (err)
                return res.status(http_status_codes_1.BAD_REQUEST).send(err);
            if (doc) {
                return res.sendStatus(http_status_codes_1.OK);
            }
            else {
                return res
                    .sendStatus(http_status_codes_1.NOT_FOUND)
                    .json({ message: 'user id not found' });
            }
        });
    }),
    add: (req, res) => {
        const itemToAdd = new Items_1.Item(req.body);
        const { item_name, category } = req.body;
        Items_1.Item.findOne({ item_name, category }, (err, doc) => {
            if (err)
                return res.status(http_status_codes_1.BAD_REQUEST).send(err);
            if (doc) {
                return res.status(http_status_codes_1.CONFLICT).json({ message: 'Item already exists' });
            }
            else {
                itemToAdd.save((err) => {
                    if (err)
                        return res.status(500).send(err);
                    return res.status(http_status_codes_1.CREATED).json({ message: 'Item added' });
                });
            }
        });
    },
    modify: (req, res) => {
        const itemToChange = req.body;
        const itemID = req.query.id;
        console.log(itemToChange);
        Items_1.Item.findByIdAndUpdate(itemID, itemToChange, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ message: 'DB error while updating' });
            if (doc) {
                console.log('Updated Document');
                return res
                    .status(http_status_codes_1.OK)
                    .json({ success: true, message: 'successfully updated' });
            }
            else {
                console.log('No document found');
                return res
                    .status(http_status_codes_1.OK)
                    .json({ success: true, message: 'Item not found' });
            }
        });
    },
};
