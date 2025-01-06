// pages/api/progress/product-progress.ts
import { NextApiRequest, NextApiResponse } from "next";
import { fetchCustomer, validateSession } from "@/lib/auth";
import { connectDB } from "@shared/lib/mongodb";
import { PageModel } from "@shared/models/page-model";
import { CustomerProgressModel } from "@shared/models/customer-progress-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const sessionUser = await validateSession(req, res);
  const customer = await fetchCustomer(sessionUser.email!);

  const { productId } = req.query;

  if (!customer._id || !productId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get total pages in the product
  const totalPages = await PageModel.countDocuments({ product: productId });

  // Get completed pages for the customer
  const completedPages = await CustomerProgressModel.countDocuments({
    customer: customer._id,
    product: productId,
    isCompleted: true,
  });

  const progress = (completedPages / totalPages) * 100;

  res.status(200).json({ progress, totalPages, completedPages });
}
