import { BlockController } from "@shared/controllers/block-controller";
import { connectDB } from "@shared/lib/mongodb";
import { match } from "ts-pattern";
import { NextApiRequest, NextApiResponse } from "next";
import { Errors } from "@shared/lib/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  return match(req.method)
    .with("GET", () => BlockController.handleGetAllByPage(req, res))
    .with("POST", () => BlockController.handlePost(req, res))
    .otherwise(() => {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json(Errors.METHOD_NOT_SUPPORTED);
    });
}
