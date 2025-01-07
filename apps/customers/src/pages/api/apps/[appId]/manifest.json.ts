import { getToken } from "@chakra-ui/react";
import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
import { colorsTheme } from "@shared/lib/theme";
import { AppRepository } from "@shared/repositories/app-repository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const { appId } = req.query;

  if (!appId) return res.status(400).json(Errors.BAD_REQUEST);

  const app = await AppRepository.getById(appId?.toString());

  if (!app) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

  const backgroundColor = getToken(
    "colors",
    `${app.colorScheme}.50` as string,
    "gray.500",
  )(colorsTheme);
  const themeColor = getToken(
    "colors",
    `${app.colorScheme}.500` as string,
    "gray.500",
  )(colorsTheme);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    name: app.name ?? `PWA ${appId}`,
    short_name: app.name ?? appId,
    start_url: `/apps/${appId}/`,
    scope: `/apps/${appId}/`,
    display: "standalone",
    background_color: backgroundColor,
    theme_color: themeColor,
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
