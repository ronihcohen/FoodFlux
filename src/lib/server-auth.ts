import { getServerSession } from "next-auth";
import { auth as options } from "@/lib/auth";

export async function getServerAuthSession() {
  return getServerSession(options);
}


