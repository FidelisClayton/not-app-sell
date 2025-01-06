import { ProductController } from "@shared/controllers/product-controller";
import { connectDB } from "@shared/lib/mongodb";
import { match } from "ts-pattern";
import { NextApiRequest, NextApiResponse } from "next";
import { fetchUser, validateSession } from "@shared/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const sessionUser = await validateSession(req, res);
  const user = await fetchUser(sessionUser.email!);

  return match(req.method)
    .with("POST", () => ProductController.handlePost(req, res, user))
    .otherwise(() => {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method Not Allowed" });
    });
}
