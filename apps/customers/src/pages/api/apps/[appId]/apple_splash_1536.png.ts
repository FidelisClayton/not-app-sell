import { handleSplashGeneration } from "@/lib/handle-splash-generation";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return handleSplashGeneration(req, res);
}
