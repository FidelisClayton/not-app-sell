import { AppController } from "@shared/controllers/app-controller";
import { fetchUser, validateSession } from "@shared/lib/auth";
import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
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
    .with({ method: "GET" }, () => AppController.handleGetById(req, res, user))
    .with({ method: "PUT" }, () => AppController.handlePut(req, res, user))
    .with({ method: "DELETE" }, () =>
      AppController.handleDelete(req, res, user),
    )
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
