// pages/api/progress/product-progress.ts
import { NextApiRequest, NextApiResponse } from "next";
import { fetchCustomer, validateSession } from "@/lib/auth";
import { connectDB } from "@shared/lib/mongodb";
import { CustomerProgressModel } from "@shared/models/customer-progress-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("PROGRESS");
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const sessionUser = await validateSession(req, res);
  const customer = await fetchCustomer(sessionUser.email!);

  const { productId } = req.query;

  if (!customer._id || !productId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const customerProgress = await CustomerProgressModel.find({
    product: productId,
    customer: customer._id,
  });

  res.status(200).json(customerProgress);
}
