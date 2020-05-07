"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const ItemSchema = new mongoose_1.Schema({
    item_name: String,
    category: String,
    price: { type: Number, default: 0 },
    image: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
}, { collection: 'Items' });
exports.Item = mongoose_1.default.model('Item', ItemSchema);
