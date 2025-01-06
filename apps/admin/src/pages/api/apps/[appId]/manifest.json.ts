import { apps } from "@shared/lib/mock";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { appId } = req.query;
  const app = apps.find((app) => app.slug === appId);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    name: app?.name ?? `PWA ${appId}`,
    short_name: app?.name ?? appId,
    start_url: `/apps/${appId}/`,
    scope: `/apps/${appId}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: `/api/apps/${appId}/icon.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `/api/apps/${appId}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  });
}
