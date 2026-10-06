import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
const region = process.env.S3_REGION || 'us-east-1';
const accessKeyId = process.env.S3_ACCESS_KEY || 'minio';
const secretAccessKey = process.env.S3_SECRET_KEY || 'minio123';
const Bucket = process.env.STORAGE_BUCKET || 'uploads';

export const s3 = new S3Client({
  endpoint,
  region,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

export async function ensureBucket() {
  // Optionally implement bucket creation at bootstrap if needed
}

export async function putObject(Key, Body, ContentType = 'application/octet-stream') {
  const cmd = new PutObjectCommand({ Bucket, Key, Body, ContentType });
  return s3.send(cmd);
}

export async function getSignedUrlForKey(Key, expiresInSec = 600) {
  const cmd = new GetObjectCommand({ Bucket, Key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresInSec });
  return url;
}
