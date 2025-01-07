import { fetchCustomer, validateSession } from "@/lib/auth";
import { connectDB } from "@shared/lib/mongodb";
import { CustomerProgressModel } from "@shared/models/customer-progress-model";
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
    .lean(); // Use lean() if you only need the plain object

  return latestProgress;
}
