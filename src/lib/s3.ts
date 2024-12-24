import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const generatePresignedUrl = async (
  fileName: string,
  fileType: string,
  expiresInSeconds = 60,
) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
    Expires: expiresInSeconds, // URL expiration time
  };

  try {
    return await s3.getSignedUrlPromise("putObject", params);
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Could not generate pre-signed URL");
  }
};
