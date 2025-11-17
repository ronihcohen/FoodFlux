import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { dateKey?: string; calories?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const dateKey = String(body.dateKey ?? "");
  const calories = Number(body.calories ?? 0);

  if (!dateKey || dateKey.length < 8 || dateKey.length > 10) {
    return NextResponse.json({ error: "Invalid date key" }, { status: 400 });
  }
  if (!Number.isFinite(calories) || calories < 50) {
    return NextResponse.json({ error: "Calories must be at least 50" }, { status: 400 });
  }

  try {
    await prisma.entry.create({
      data: {
        userId: session.user.id,
        dateKey,
        name: "Unknown meal",
        calories,
      },
    });

    revalidatePath(`/?date=${dateKey}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
