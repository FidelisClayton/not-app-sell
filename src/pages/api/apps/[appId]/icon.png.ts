import { apps } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { appId } = req.query;
  const app = apps.find((app) => app.slug === appId);

  try {
    // Example: Fetch icon from a cloud bucket
    const iconUrl =
      app?.logoUrl ??
      `https://i0.wp.com/elite.kiwify.com.br/wp-content/uploads/2023/09/logo.png?w=300&ssl=1`;
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
