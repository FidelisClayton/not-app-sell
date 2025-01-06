import { AppRepository } from "@/repositories/app-repository";
import { CustomerAppRepository } from "@/repositories/customer-app-repository";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { connectDB } from "@shared/lib/mongodb";
import { Errors } from "@shared/lib/error";
import { fetchUser, validateSession } from "@shared/lib/auth";

const querySchema = z.object({
  appId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await connectDB();

    const sessionUser = await validateSession(req, res);
    const user = await fetchUser(sessionUser.email!);

    const { appId } = querySchema.parse(req.query);

    const app = await AppRepository.getById(appId);

    if (!app) {
      return res.status(404).json(Errors.RESOURCE_NOT_FOUND);
    }

    if (user.id !== String(app.createdBy)) {
      return res.status(403).json(Errors.FORBIDDEN);
    }

    const customers = await CustomerAppRepository.findByApp(appId);
    return res.status(200).json(customers);
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }

    return res.status(500).json(Errors.UNEXPECTED_ERROR);
  }
}
