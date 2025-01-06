import { adminAuthOptions } from "@/lib/auth";
import NextAuth from "next-auth";

export default NextAuth(adminAuthOptions);
