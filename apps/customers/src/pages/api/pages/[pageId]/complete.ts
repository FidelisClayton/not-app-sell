import { fetchCustomer, validateSession } from "@/lib/auth";
import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
import { CustomerProgressModel } from "@shared/models/customer-progress-model";
import { PageRepository } from "@shared/repositories/page-repository";
import { ProductRepository } from "@shared/repositories/product-repository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { pageId } = req.body;

  if (!pageId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await connectDB();
  const sessionUser = await validateSession(req, res);
  const customer = await fetchCustomer(sessionUser.email!);

  const page = await PageRepository.getById(pageId);

  if (!page) {
    return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
  }

  const productId = String(page.product);
  const product = await ProductRepository.getById(productId);

  if (!product) {
    return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
  }

  const progress = await CustomerProgressModel.findOneAndUpdate(
    { customer: customer._id, product: productId, page: pageId },
    { isCompleted: true, completedAt: new Date() },
    { upsert: true, new: true },
  );

  return res.status(200).json({ success: true, progress });
}
