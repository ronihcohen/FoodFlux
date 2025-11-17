import { randomBytes } from "crypto";
import { getServerAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/widget/token
 *   - returns the current widget token for the signed-in user (or null)
 * POST /api/widget/token
 *   - body: { action: 'generate' | 'revoke' }
 *   - generate: creates and stores a new token (returns token)
 *   - revoke: removes the stored token
 */
export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { widgetToken: true },
  });

  return Response.json({ token: user?.widgetToken ?? null });
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = (body.action as string) || "generate";

  if (action === "revoke") {
    await prisma.user.update({ where: { id: session.user.id }, data: { widgetToken: null } });
    return Response.json({ revoked: true });
  }

  if (action === "generate") {
    // Try a few times to avoid unique collisions
    for (let i = 0; i < 5; i++) {
      const token = randomBytes(24).toString("hex");
      try {
        const user = await prisma.user.update({ where: { id: session.user.id }, data: { widgetToken: token } });
        return Response.json({ token: user.widgetToken });
      } catch (err) {
        // likely unique constraint collision; try again
        console.warn("widget token generation collision, retrying", err);
      }
    }

    return Response.json({ error: "Failed to generate token" }, { status: 500 });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
