import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET,
  REGION,
} from "./APIConstants";

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export const uploadToS3 = async (file, onProgress = null) => {
  const Key = new Date().getTime() + file.name.replace(/\s/g, "");

  try {
    const params = {
      Bucket: AWS_BUCKET,
      Key,
      Body: file,
      ContentDisposition: "inline",
      ContentType: file.type,
    };
    const options = {
      partSize: 5 * 1024 * 1024, // 5 MB parts
      queueSize: 4,
      leavePartsOnError: false,
    };

    const parallelUploadS3 = new Upload({
      client: s3Client,
      params,
      ...options,
    });

    parallelUploadS3.on("httpUploadProgress", (progress) => {
      const percentUploaded = Math.round(
        (progress.loaded / progress.total) * 100
      );
      onProgress && onProgress(percentUploaded);
    });

    await parallelUploadS3.done();

    return Key;
  } catch (error) {
    console.error("Error uploading file to S3", error);
    throw error;
  }
};

export const deleteObjectToS3 = async (key) => {
  const input = {
    Bucket: AWS_BUCKET, // required
    Key: key, // required
  };
  try {
    const command = new DeleteObjectCommand(input);
    await s3Client.send(command);
  } catch (error) {
    console.error("Error Delete file to S3", error);
    throw error;
  }
};
