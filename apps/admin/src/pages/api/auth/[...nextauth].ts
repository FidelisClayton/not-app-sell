import NextAuth from "next-auth";
import { adminAuthOptions } from "@shared/lib/auth";

export default NextAuth(adminAuthOptions);
