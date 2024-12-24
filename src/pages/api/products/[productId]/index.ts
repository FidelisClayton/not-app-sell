import { ProductController } from "@/controllers/product-controller";
import { connectDB } from "@/lib/mongodb";
import { fetchUser, validateSession } from "@/lib/auth";
import { Errors } from "@/lib/error";
import { NextApiRequest, NextApiResponse } from "next";
import { match } from "ts-pattern";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const sessionUser = await validateSession(req, res);
  const user = await fetchUser(sessionUser.email!);

  return match(req)
    .with({ method: "GET" }, () =>
      ProductController.handleGetById(req, res, user),
    )
    .with({ method: "PUT" }, () => ProductController.handlePut(req, res, user))
    .with({ method: "DELETE" }, () =>
      ProductController.handleDelete(req, res, user),
    )
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
