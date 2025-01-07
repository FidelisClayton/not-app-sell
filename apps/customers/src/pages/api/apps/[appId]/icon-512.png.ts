import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
import { AppRepository } from "@shared/repositories/app-repository";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const { appId } = req.query;

  if (!appId) return res.status(400).json(Errors.BAD_REQUEST);

  const app = await AppRepository.getById(appId.toString());

  if (!app) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

  try {
    // Example: Fetch icon from a cloud bucket
    const iconUrl = app.logoUrl;

    if (!iconUrl) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    const response = await fetch(iconUrl);

    if (!response.body || !response.ok) {
      throw new Error("Icon not found");
    }

    // Set appropriate headers and stream the image
    res.setHeader("Content-Type", "image/png");
    response.body.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Icon not found" });
  }
}
