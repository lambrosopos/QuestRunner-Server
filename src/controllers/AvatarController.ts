import { Request, Response } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { User, UserDocument } from '@models/Users';

import AWS from 'aws-sdk';

const { accessKeyId, secretAccessKey, bucketName } = process.env;
const signedUrlExpireSeconds = 60 * 60;
const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  useAccelerateEndpoint: false,
});

export default {
  get: (req: Request, res: Response) => {
    const userID = req.user.uid;

    User.findById(userID, (err: any, doc: UserDocument) => {
      if (err)
        return res
          .status(BAD_REQUEST)
          .json({ message: 'DB error in finding ID' });
      if (doc) {
        const params: any = {
          Bucket: bucketName,
          Key: userID,
        };
        s3.getObject(params, (err: AWS.AWSError, data: any) => {
          if (err) {
            console.log('Error while retrieving bucket object');
            return res.status(BAD_REQUEST).json({
              success: false,
              message: 'Error while retrieving bucket object',
              err,
            });
          } else {
            return res.status(OK).json({
              sucesss: true,
              messsage: 'Found user',
              url: doc.profilePic,
            });
          }
        });
      } else {
        return res
          .status(NOT_FOUND)
          .json({ success: false, message: 'User not found' });
      }
    });
  },
  post: (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ message: 'No file attached' });
    } else {
      const userID = req.user.uid;

      const finalImg = {
        original_name: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer,
        size: req.file.size,
      };

      const params: any = {
        Bucket: bucketName,
        Key: userID,
        Expires: signedUrlExpireSeconds,
        ACL: 'bucket-owner-full-control',
        ContentType: finalImg.contentType,
        Body: finalImg.image,
      };

      s3.putObject(params, (err: AWS.AWSError, data: any) => {
        if (err) {
          console.log('Error getting presigned url from AWS S3');
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'AWS S3 error', err });
        } else {
          console.log('Successfully uploaded file');
          console.log(finalImg);

          const AWS_URL =
            'https://qrunner-avatar.s3.ap-northeast-2.amazonaws.com';

          User.findByIdAndUpdate(
            userID,
            {
              $set: {
                profilePic: AWS_URL + String(data.ETag).replace(/\"/g, ''),
              },
            },
            { new: true },
            (err: any, doc: any) => {
              if (err)
                return res.status(BAD_REQUEST).json({
                  success: false,
                  message: 'Error while updating mongodb document',
                });
              console.log('=========   Updated Document   =========');
              console.log(doc);
              return res.status(OK).json({
                success: true,
                message: 'Successfully updated document',
              });
            }
          );
        }
      });
    }
  },
};
