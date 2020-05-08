"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const Users_1 = require("@models/Users");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const { accessKeyId, secretAccessKey, bucketName } = process.env;
const signedUrlExpireSeconds = 60 * 60;
const s3 = new aws_sdk_1.default.S3({
    accessKeyId,
    secretAccessKey,
    useAccelerateEndpoint: false,
});
exports.default = {
    get: (req, res) => {
        const userID = req.user.uid;
        Users_1.User.findById(userID, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ message: 'DB error in finding ID' });
            if (doc) {
                const params = {
                    Bucket: bucketName,
                    Key: userID,
                };
                s3.getObject(params, (err, data) => {
                    if (err) {
                        console.log('Error while retrieving bucket object');
                        return res.status(http_status_codes_1.BAD_REQUEST).json({
                            success: false,
                            message: 'Error while retrieving bucket object',
                            err,
                        });
                    }
                    else {
                        return res.status(http_status_codes_1.OK).json({
                            sucesss: true,
                            messsage: 'Found user',
                            url: doc.profilePic,
                        });
                    }
                });
            }
            else {
                return res
                    .status(http_status_codes_1.NOT_FOUND)
                    .json({ success: false, message: 'User not found' });
            }
        });
    },
    post: (req, res) => {
        if (!req.file) {
            return res.status(http_status_codes_1.BAD_REQUEST).json({ message: 'No file attached' });
        }
        else {
            const userID = req.user.uid;
            const finalImg = {
                original_name: req.file.originalname,
                contentType: req.file.mimetype,
                image: req.file.buffer,
                size: req.file.size,
            };
            const params = {
                Bucket: bucketName,
                Key: userID,
                Expires: signedUrlExpireSeconds,
                ACL: 'bucket-owner-full-control',
                ContentType: finalImg.contentType,
                Body: finalImg.image,
            };
            s3.putObject(params, (err, data) => {
                if (err) {
                    console.log('Error getting presigned url from AWS S3');
                    return res
                        .status(http_status_codes_1.BAD_REQUEST)
                        .json({ success: false, message: 'AWS S3 error', err });
                }
                else {
                    console.log('Successfully uploaded file');
                    console.log(finalImg);
                    const AWS_URL = 'https://qrunner-avatar.s3.ap-northeast-2.amazonaws.com';
                    Users_1.User.findByIdAndUpdate(userID, {
                        $set: {
                            profilePic: AWS_URL + String(data.ETag).replace(/\"/g, ''),
                        },
                    }, { new: true }, (err, doc) => {
                        if (err)
                            return res.status(http_status_codes_1.BAD_REQUEST).json({
                                success: false,
                                message: 'Error while updating mongodb document',
                            });
                        console.log('=========   Updated Document   =========');
                        console.log(doc);
                        return res.status(http_status_codes_1.OK).json({
                            success: true,
                            message: 'Successfully updated document',
                        });
                    });
                }
            });
        }
    },
};
