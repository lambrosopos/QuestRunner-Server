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
        exp_bar: { type: Object },
        background: { type: Object },
        darkmode: { type: Object },
    },
    experience: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    quests: Array,
    todolist: Array,
    items: {
        exp_bar: Array,
        background: Array,
    },
    created_at: { type: Date, default: Date.now },
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
