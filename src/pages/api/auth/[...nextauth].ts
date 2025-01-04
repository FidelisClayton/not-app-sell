import NextAuth from "next-auth";
import { adminAuthOptions } from "@/lib/auth";

export default NextAuth(adminAuthOptions);
