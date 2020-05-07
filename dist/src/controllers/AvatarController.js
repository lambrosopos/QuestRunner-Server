"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_status_codes_1 = require("http-status-codes");
const Users_1 = require("@models/Users");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
exports.default = {
    get: (req, res) => {
        const userID = req.user.uid;
        Users_1.User.findById(userID, (err, doc) => {
            if (err)
                return res
                    .status(http_status_codes_1.BAD_REQUEST)
                    .json({ message: 'DB error in finding ID' });
            if (doc) {
                return res
                    .status(http_status_codes_1.OK)
                    .json({ sucesss: true, messsage: 'Found user', url: doc.profilePic });
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
            const finalImg = {
                original_name: req.file.originalname,
                contentType: req.file.mimetype,
                image: req.file.buffer,
                size: req.file.size,
            };
            const { accessKeyId, secretAccessKey, bucketName } = process.env;
            const signedUrlExpireSeconds = 60 * 60;
            const s3 = new aws_sdk_1.default.S3({
                accessKeyId,
                secretAccessKey,
                useAccelerateEndpoint: false,
            });
            const params = {
                Bucket: bucketName,
                Key: finalImg.original_name,
                Expires: signedUrlExpireSeconds,
                ACL: 'bucket-owner-full-control',
                ContentType: finalImg.contentType,
            };
            s3.getSignedUrl('putObject', params, (err, url) => {
                if (err) {
                    console.log('Error getting presigned url from AWS S3');
                    return res
                        .status(http_status_codes_1.BAD_REQUEST)
                        .json({ success: false, message: 'Pre-signed URL error' });
                }
                else {
                }
            });
            console.log(finalImg);
            return res.status(http_status_codes_1.OK).json({ success: true, message: 'saved to s3' });
        }
    },
};
//# sourceMappingURL=AvatarController.js.map