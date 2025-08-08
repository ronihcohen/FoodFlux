import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt";

export async function GET() {
  const email = "demo@foodflux.dev";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await hash("demo1234", 10);
    await prisma.user.create({ data: { email, name: "Demo User", passwordHash } });
  }
  return NextResponse.json({ ok: true, email, password: "demo1234" });
}


