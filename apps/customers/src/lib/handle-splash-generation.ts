import { createCanvas, Image } from "canvas";

import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
import { AppRepository } from "@shared/repositories/app-repository";
import { NextApiRequest, NextApiResponse } from "next";
import { colorsTheme } from "@shared/lib/theme";
import sharp from "sharp";

const generateImage = async ({
  width,
  height,
  primaryColor,
  logoUrl,
}: {
  width: string | string[] | number;
  height: string | string[] | number;
  primaryColor: string;
  logoUrl: string;
}) => {
  const canvas = createCanvas(Number(width), Number(height));
  const ctx = canvas.getContext("2d");

  // Set background color
  ctx.fillStyle = String(primaryColor);
  ctx.fillRect(0, 0, Number(width), Number(height));

  // Load the logo
  const response = await fetch(String(logoUrl));

  if (!response.ok) {
    throw new Error(`Failed to fetch logo: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  const processedLogo = await sharp(buffer).toFormat("png").toBuffer();

  const logo = new Image();
  logo.src = processedLogo;

  // Calculate dimensions to center the logo
  const logoSize = Math.min(Number(width), Number(height)) * 0.2; // Scale to 50% of smaller dimension
  const logoX = (Number(width) - logoSize) / 2;
  const logoY = (Number(height) - logoSize) / 2;

  // Draw the logo
  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

  return canvas.toBuffer("image/png");
};

export async function handleSplashGeneration(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { appId, width = 1024, height = 1024 } = req.query;

  if (typeof appId !== "string")
    return res.status(400).json(Errors.BAD_REQUEST);

  await connectDB();
  const app = await AppRepository.getById(appId);

  if (!app) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

  try {
    // Example: Fetch icon from a cloud bucket
    const iconUrl = app.logoUrl;

    if (!iconUrl) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    const response = await fetch(iconUrl);

    if (!response.body || !response.ok) {
      throw new Error("Icon not found");
    }

    const image = await generateImage({
      width,
      height,
      primaryColor: app.colorScheme
        ? colorsTheme.colors[app.colorScheme]["100"]
        : "#ffffff",
      logoUrl: app.logoUrl ?? "",
    });

    // Set appropriate headers and stream the image
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(image);
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ error: "Icon not found" });
  }
}
