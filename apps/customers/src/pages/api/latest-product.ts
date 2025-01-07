import { fetchCustomer, validateSession } from "@/lib/auth";
import { Errors } from "@shared/lib/error";
import { connectDB } from "@shared/lib/mongodb";
import {
  CustomerProgress,
  CustomerProgressModel,
} from "@shared/models/customer-progress-model";
import { ProductRepository } from "@shared/repositories/product-repository";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const sessionUser = await validateSession(req, res);
  const customer = await fetchCustomer(sessionUser.email!);

  if (!customer._id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const latestProgress = await CustomerProgressModel.findOne({
    customer: customer._id,
  })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .lean<CustomerProgress>(); // Use lean() if you only need the plain object

  if (!latestProgress) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

  const latestProduct = await ProductRepository.getById(latestProgress.product);

  if (!latestProduct) return res.status(404).json(Errors.RESOURCE_NOT_FOUND);

  return res.status(200).json(latestProduct);
}
