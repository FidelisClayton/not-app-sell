import { connectDB } from "@shared/lib/mongodb";
import { UserModel } from "@shared/models/user-model";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    console.log("Method not supported");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  try {
    await connectDB();
    const existingUser = await UserModel.findOne({ email }).exec();

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ user: savedUser });
  } catch (e) {
    console.log((e as Error).message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
