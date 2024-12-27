import { PageController } from "@/controllers/page-controller";
import { Errors } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { match } from "ts-pattern";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  return match(req)
    .with({ method: "GET" }, () => PageController.handleGetAll(req, res))
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
