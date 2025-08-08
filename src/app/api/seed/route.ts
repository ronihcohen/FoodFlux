import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const email = "demo@foodflux.dev";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({ data: { email, name: "Demo User" } });
  }
  return NextResponse.json({ ok: true, email, message: "Demo user created. Please sign in with Google OAuth." });
}


