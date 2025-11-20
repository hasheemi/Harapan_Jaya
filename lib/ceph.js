import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://is3.cloudhost.id/",
  region: "us-east-1", // sesuaikan dengan region Anda
  credentials: {
    accessKeyId: process.env.CEPH_ACCESS_KEY,
    secretAccessKey: process.env.CEPH_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = "jagatirta";

export { s3Client, BUCKET_NAME };
