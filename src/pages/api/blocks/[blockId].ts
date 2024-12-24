// pages/api/blocks/[blockId].ts
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
    .with("PUT", () => BlockController.handlePut(req, res))
    .with("DELETE", () => BlockController.handleDelete(req, res))
    .otherwise(() => {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json(Errors.METHOD_NOT_SUPPORTED);
    });
}
