import credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import {
  CustomerAppRepository,
  CustomerRepository,
} from "@shared/repositories";
import { mongodbClient } from "@shared/lib/db";
import { connectDB } from "@shared/lib/mongodb";
import { createError } from "@shared/lib/error";

export const adminAuthOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(mongodbClient),
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials, req) {
        // REQ must have appId
        // Check whether or not the email is associated with the app (CustomerApp)
        // Check whether or not the subscription is active
        try {
          await connectDB();

          if (!credentials) {
            throw new Error("`credentials` is missing.");
          }

          const customer = await CustomerRepository.findByEmail(
            credentials.email,
          );

          if (!customer) {
            throw new Error("`customer` is missing.");
          }

          const customerApp = await CustomerAppRepository.findByCustomerAndApp(
            customer._id.toString(),
            req.body?.appId,
          );

          if (!customerApp?.isActive)
            throw new Error("The subscription is not active");

          return {
            id: customer._id,
            email: customer.email,
            name: customer.name,
          };
        } catch (e) {
          console.error(e);

          return null;
        }
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

export const getSessionCustomer = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, adminAuthOptions);

  if (!session?.user?.email) return null;

  await connectDB();
  const customer = await CustomerRepository.findByEmail(session.user.email);

  if (!customer) return null;

  return customer;
};

export const validateSession = async (
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"],
) => {
  const session = await getServerSession(req, res, adminAuthOptions);
  if (!session?.user)
    throw createError("UNAUTHORIZED", "User not logged in", 401);
  return session.user;
};

export const fetchCustomer = async (email: string) => {
  const user = await CustomerRepository.findByEmail(email);
  if (!user) throw createError("UNAUTHORIZED", "User not found", 401);
  return user;
};
