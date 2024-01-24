/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class AWSS3Service {
  constructor(
    @Inject('S3') private s3: AWS.S3,
    @Inject('S3_BUCKET_NAME') private bucketName: string,
  ) {}

  async getSignUrlForFile(
    uniqKey?: string,
  ): Promise<{ signedUrl: string; fileName: string }> {
    if (!uniqKey) return { signedUrl: '', fileName: '' };

    const fileName = path.basename(uniqKey);
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.bucketName,
      Key: uniqKey,
      Expires: 30 * 60,
    };

    const signedUrl = this.s3.getSignedUrl('getObject', params);

    if (!signedUrl) {
      throw new Error('Cannot create signed URL');
    }

    return {
      signedUrl,
      fileName,
    };
  }

  async upload(
    filepath: string,
    name?: string,
    options?: { resize?: { width: number; height: number } },
  ): Promise<{ filepath: string; data: AWS.S3.PutObjectOutput[] }> {
    if (!fs.existsSync(filepath)) {
      throw new Error(`File ${filepath} does not exist`);
    }

    const res: { filepath: string; data: AWS.S3.PutObjectOutput[] } = {
      filepath: filepath,
      data: [],
    };

    const fileBinaryString = fs.readFileSync(filepath);
    const params: AWS.S3.PutObjectRequest = {
      Body: fileBinaryString,
      Bucket: this.bucketName,
      Key: name,
    };

    const data = await this.s3.putObject(params).promise();
    data.name = name;
    res.data.push(data);

    if (options?.resize) {
      await this.uploadResizedImage(filepath, params, options.resize, res);
    }

    return res;
  }

  private async uploadResizedImage(
    filepath: string,
    params: AWS.S3.PutObjectRequest,
    resize: { width: number; height: number },
    res: { filepath: string; data: AWS.S3.PutObjectOutput[] },
  ) {
    const { width, height } = resize;

    const buffer = await sharp(filepath).resize(width, height).toBuffer();
    params.Body = buffer;
    params.Key = `${width}-${height}-${params.Key}`;

    const data = await this.s3.putObject(params).promise();
    data.name = params.Key;
    res.data.push(data);
  }
}
