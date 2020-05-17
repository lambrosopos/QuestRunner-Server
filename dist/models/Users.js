"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    username: String,
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePic: { type: String, default: '' },
    motto: { type: String, default: '' },
    active: {
        exp_bar: {
            type: Object,
            default: {
                _id: '5eb22ee884db8e67425366eb',
                price: 0,
                item_name: 'Default',
                category: 'exp_bar',
                data: '#ffff00',
                image: 'https://quest-runner.s3.ap-northeast-2.amazonaws.com/exp_bar/default.png',
                created_at: '2020-05-06T03:28:40.739+00:00',
                __v: 0,
            },
        },
        background: {
            type: Object,
            default: {
                _id: '5eb22eb684db8e67425366e2',
                price: 0,
                item_name: 'Default',
                category: 'background',
                image: 'https://quest-runner.s3.ap-northeast-2.amazonaws.com/background/default.png',
                created_at: '2020-05-06T03:27:50.591+00:00',
                __v: 0,
            },
        },
        darkmode: { type: Object, default: {} },
    },
    experience: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    quests: Array,
    todolist: Array,
    items: {
        exp_bar: {
            type: Array,
            default: [
                {
                    _id: '5eb22eb684db8e67425366e2',
                    price: 0,
                    item_name: 'Default',
                    category: 'exp_bar',
                    data: '#ffff00',
                    image: 'https://quest-runner.s3.ap-northeast-2.amazonaws.com/exp_bar/default.png',
                    created_at: '2020-05-06T03:27:50.591+00:00',
                    __v: 0,
                },
            ],
        },
        background: {
            type: Array,
            default: [
                {
                    _id: '5eb22eb684db8e67425366e2',
                    price: 0,
                    item_name: 'Default',
                    category: 'background',
                    image: 'https://quest-runner.s3.ap-northeast-2.amazonaws.com/background/default.png',
                    data: '',
                    created_at: '2020-05-06T03:27:50.591+00:00',
                    __v: 0,
                },
            ],
        },
        darkmode: Array,
    },
    created_at: { type: Date, default: Date.now },
    darkmode: { type: Boolean, default: false },
}, { collection: 'Users' });
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt_1.default.genSalt(10, function (err, salt) {
        if (err)
            return next(err);
        bcrypt_1.default.hash(user.password, salt, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
exports.User = mongoose_1.default.model('User', UserSchema);
