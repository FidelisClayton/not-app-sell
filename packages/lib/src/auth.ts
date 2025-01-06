import { connectDB } from "./mongodb";
import { mongodbClient } from "@/db";
import { UserModel } from "@shared/models";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "@shared/repositories";
import { createError } from "./error";

export const adminAuthOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(mongodbClient),
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectDB();

        const user = await UserModel.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login", // Custom login page
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-expect-error wip
      session.accessToken = token;
      return session;
    },
  },
};

export const getSessionUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, adminAuthOptions);

  if (!session?.user?.email) return null;

  await connectDB();
  const user = await UserRepository.getByEmail(session.user.email);

  if (!user) return null;

  return user;
};

export const validateSession = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, adminAuthOptions);
  if (!session?.user)
    throw createError("UNAUTHORIZED", "User not logged in", 401);
  return session.user;
};

export const fetchUser = async (email: string) => {
  const user = await UserRepository.getByEmail(email);
  if (!user) throw createError("UNAUTHORIZED", "User not found", 401);
  return user;
};
