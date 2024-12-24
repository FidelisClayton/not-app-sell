import { generatePresignedUrl } from "@/lib/s3";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const uploadUrl = await generatePresignedUrl(fileName, fileType);
    return res.status(200).json({ uploadUrl });
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
}
