import { PageController } from "@/controllers/page-controller";
import { fetchUser, validateSession } from "@/lib/auth";
import { Errors } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
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
    .with({ method: "POST" }, () => PageController.handlePost(req, res, user))
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
