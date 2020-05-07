"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const Users_1 = require("../models/Users");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const jwtAuthenticator_1 = require("../middlewares/jwtAuthenticator");
exports.default = {
    getInfo: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const doc_id = req.user.uid;
        Users_1.User.findOne({ _id: doc_id }, (err, doc) => {
            if (err)
                return res.sendStatus(http_status_codes_1.NOT_FOUND);
            if (!doc) {
                return res.status(http_status_codes_1.NOT_FOUND).json({ message: "user doesn't exist" });
            }
            else {
                return res.status(http_status_codes_1.OK).json(doc);
            }
        });
    }),
    signin: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        Users_1.User.findOne({ email }, (err, doc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.sendStatus(http_status_codes_1.BAD_REQUEST);
            if (!doc) {
                return res.status(http_status_codes_1.NOT_FOUND).json({ message: "user doesn't exist" });
            }
            else {
                bcrypt_1.default.compare(password, doc.password, (err, result) => {
                    if (err)
                        return res.status(http_status_codes_1.BAD_REQUEST).send(err);
                    if (result) {
                        const id = doc['_id'];
                        const accessToken = jsonwebtoken_1.default.sign({ uid: id }, jwtAuthenticator_1.accessTokenSecret, {
                            expiresIn: jwtAuthenticator_1.accessTokenExpiresIn,
                        });
                        const refreshToken = jsonwebtoken_1.default.sign({ uid: id }, jwtAuthenticator_1.refreshTokenSecret, {
                            expiresIn: jwtAuthenticator_1.refreshTokenExpiresIn,
                        });
                        jwtAuthenticator_1.refreshTokenList.push(refreshToken);
                        return res.status(http_status_codes_1.OK).json({ accessToken, refreshToken });
                    }
                    else {
                        return res.status(http_status_codes_1.UNAUTHORIZED).json({ message: 'wrong password' });
                    }
                });
            }
        }));
    }),
    signup: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        let user = new Users_1.User({
            username,
            email,
            password,
        });
        Users_1.User.findOne({ email }, (err, doc) => {
            if (err)
                return res.sendStatus(http_status_codes_1.BAD_REQUEST);
            if (!doc) {
                user.save((err) => {
                    if (err)
                        return res.status(302).send(err);
                    return res.status(http_status_codes_1.CREATED).json({ message: 'successfully added' });
                });
            }
            else {
                return res.status(302).json({ message: 'user already exists' });
            }
        });
    }),
    modify: (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const userID = req.user.uid;
        const updatePW = (infoToChange) => {
            Users_1.User.findByIdAndUpdate(userID, { $set: infoToChange }, { new: true }, (err, doc) => {
                if (err)
                    res.status(http_status_codes_1.BAD_REQUEST).send(err);
                console.log('Updated doc');
                console.log(doc);
            });
        };
        const infoToChange = {};
        const { motto, username, password } = req.body;
        if (motto)
            infoToChange.motto = motto;
        if (username)
            infoToChange.username = username;
        if (password) {
            yield bcrypt_1.default.hash(password, 10, (err, encrypted) => {
                if (err)
                    res.status(http_status_codes_1.BAD_REQUEST).send(err);
                infoToChange.password = encrypted;
                console.log(JSON.stringify(infoToChange));
                updatePW(infoToChange);
                return res.status(http_status_codes_1.OK).json({ message: 'userinfo edit success' });
            });
        }
        else {
            updatePW(infoToChange);
            return res.status(http_status_codes_1.OK).json({ message: 'userinfo edit success' });
        }
    }),
};
