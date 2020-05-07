import { Request, Response } from 'express';
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { User, UserDocument } from '@models/Users';

import AWS from 'aws-sdk';
import { config } from 'bluebird';

export default {
  get: (req: Request, res: Response) => {
    const userID = req.user.uid;

    User.findById(userID, (err: any, doc: UserDocument) => {
      if (err)
        return res
          .status(BAD_REQUEST)
          .json({ message: 'DB error in finding ID' });
      if (doc) {
        return res
          .status(OK)
          .json({ sucesss: true, messsage: 'Found user', url: doc.profilePic });
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
      const finalImg = {
        original_name: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.buffer,
        size: req.file.size,
      };

      const { accessKeyId, secretAccessKey, bucketName } = process.env;
      const signedUrlExpireSeconds = 60 * 60;
      const s3 = new AWS.S3({
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

      s3.getSignedUrl('putObject', params, (err: any, url: string) => {
        if (err) {
          console.log('Error getting presigned url from AWS S3');
          return res
            .status(BAD_REQUEST)
            .json({ success: false, message: 'Pre-signed URL error' });
        } else {
        }
      });
      console.log(finalImg);
      return res.status(OK).json({ success: true, message: 'saved to s3' });
    }
  },
};

// const AWS = require(‘aws-sdk’);
// const s3 = new AWS.S3({accessKeyId : config.aws_access_key_id, secretAccessKey : config.aws_secret_access_key, useAccelerateEndpoint: true});

// const params = {Bucket: myBucket, Key: myKey, Expires: signedUrlExpireSeconds, ACL: ‘bucket-owner-full-control’, ContentType:’text/csv’};

// s3.getSignedUrl(‘putObject’, params, function (err, url){
// if(err){
//  console.log(‘Error getting presigned url from AWS S3’);
//  res.json({ success : false, message : ‘Pre-Signed URL error’, urls : fileurls});
//  }
//  else{
//  fileurls[0] = url;
//  console.log(‘Presigned URL: ‘, fileurls[0]);
//  res.json({ success : true, message : ‘AWS SDK S3 Pre-signed urls generated successfully.’, urls : fileurls});
//  }
// });
// });
