import NextAuth, { type NextAuthOptions } from "next-auth";
import { auth } from "@/lib/auth";

const handler = NextAuth(auth as NextAuthOptions);

export { handler as GET, handler as POST };


