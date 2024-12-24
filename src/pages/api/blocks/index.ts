import { BlockController } from "@/controllers/block-controller";
import { connectDB } from "@/lib/mongodb";
import { match } from "ts-pattern";
import { NextApiRequest, NextApiResponse } from "next";
import { Errors } from "@/lib/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  return match(req.method)
    .with("POST", () => BlockController.handlePost(req, res))
    .otherwise(() => {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json(Errors.METHOD_NOT_SUPPORTED);
    });
}
