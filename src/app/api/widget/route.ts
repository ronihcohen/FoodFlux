import { format } from "date-fns";
import { getServerAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/widget
 * Accepts either a logged-in session OR a token via `?token=` or `Authorization: Bearer <token>`.
 * Returns { remaining, total, goal, date } for the user.
 */
export async function GET(req: Request) {
  try {
    // Check for token in query or Authorization header
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || (() => {
      const h = req.headers.get("authorization");
      if (!h) return null;
      const m = h.match(/^Bearer\s+(.+)$/i);
      return m ? m[1] : null;
    })();

    let userId: string | null = null;

    if (token) {
      // Find user by widgetToken
      const user = await prisma.user.findUnique({ where: { widgetToken: token } });
      if (user) userId = user.id;
    }

    // If no token or token not valid, try session auth
    if (!userId) {
      const session = await getServerAuthSession();
      if (session?.user?.id) userId = session.user.id;
    }

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayKey = format(new Date(), "yyyy-MM-dd");

    const [entries, goal] = await Promise.all([
      prisma.entry.findMany({ where: { userId, dateKey: todayKey } }),
      prisma.dailyGoal.findUnique({ where: { userId } }),
    ]);

    const total = entries.reduce((sum: number, e: { calories: number }) => sum + e.calories, 0);
    const goalCalories = goal?.goalCalories ?? 0;
    const remaining = Math.max(0, goalCalories - total);

    return Response.json({ remaining, total, goal: goalCalories, date: todayKey });
  } catch (error) {
    console.error("Widget API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
