import { ProductController } from "@shared/controllers/product-controller";
import { connectDB } from "@shared/lib/mongodb";
import { Errors } from "@shared/lib/error";
import { NextApiRequest, NextApiResponse } from "next";
import { match } from "ts-pattern";
import { fetchCustomer, validateSession } from "@/lib/auth";
import { ProductRepository } from "@shared/repositories/product-repository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const sessionUser = await validateSession(req, res);
  const customer = await fetchCustomer(sessionUser.email!);

  return match(req)
    .with({ method: "GET" }, async () => {
      if (!req.query.appId) return res.status(400).json(Errors.BAD_REQUEST);

      if (req.query.subscriptionStatus === "Active") {
        return ProductController.handleGetOwned(req, res, customer);
      } else if (req.query.subscriptionStatus === "Inactive") {
        return ProductController.handleGetUnowned(req, res, customer);
      }

      const allProducts = await ProductRepository.getAllByApp(
        req.query.appId?.toString(),
      );

      return res.status(200).json(allProducts);
    })
    .otherwise(() => res.status(405).json(Errors.METHOD_NOT_SUPPORTED));
}
