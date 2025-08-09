import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is set for Prisma at runtime, mapping from common envs used on Vercel
// Prefer DATABASE_URL; otherwise fall back to PRISMA_DATABASE_URL or POSTGRES_URL
if (!process.env.DATABASE_URL) {
  const fallbackDatabaseUrl =
    process.env.PRISMA_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    undefined;

  if (fallbackDatabaseUrl) {
    process.env.DATABASE_URL = fallbackDatabaseUrl;
  }
}

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;


