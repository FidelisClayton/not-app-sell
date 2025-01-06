import { ProductController } from "@shared/controllers/product-controller";
import { connectDB } from "@shared/lib/mongodb";
import { Errors } from "@shared/lib/error";
import { NextApiRequest, NextApiResponse } from "next";
import { match } from "ts-pattern";
import { fetchCustomer, validateSession } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const sessionUser = await validateSession(req, res);
  const user = await fetchCustomer(sessionUser.email!);

  return match(req)
    .with({ method: "GET" }, () =>
      ProductController.handleGetUnowned(req, res, user),
    )
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
