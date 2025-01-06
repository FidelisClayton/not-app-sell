import { AppController } from "@shared/controllers/app-controller";
import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { match } from "ts-pattern";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  return match(req)
    .with({ method: "GET" }, () => AppController.handleGetById(req, res))
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
