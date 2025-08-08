import { format } from "date-fns";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/db";
import { addEntry, addFoodItem, upsertGlobalDailyGoal, deleteEntry, updateFoodItem, deleteFoodPreset } from "@/app/actions";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const session = await getServerAuthSession();
  
  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Session:", session);
  }
  
  if (!session?.user?.id) {
    console.log("No session or user ID, redirecting to signin");
    redirect("/signin");
  }

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const { date } = await searchParams;
  const dateKey = date ?? todayKey;
  const prev = format(new Date(new Date(dateKey).getTime() - 24 * 60 * 60 * 1000), "yyyy-MM-dd");
  const next = format(new Date(new Date(dateKey).getTime() + 24 * 60 * 60 * 1000), "yyyy-MM-dd");

  const [entries, goal, presets] = await Promise.all([
    prisma.entry.findMany({ where: { userId: session.user.id, dateKey }, orderBy: { createdAt: "asc" } }),
    prisma.dailyGoal.findUnique({ where: { userId: session.user.id } }),
    prisma.foodItem.findMany({ where: { userId: session.user.id }, orderBy: { name: "asc" } }),
  ]);

  const total = entries.reduce((sum, e) => sum + e.calories, 0);
  const diff = (goal?.goalCalories ?? 0) - total;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card md:col-span-2">
          <div className="card-body">
            <div className="flex items-center justify-between mb-3">
              <span className="section-title">Day</span>
              <nav className="flex items-center gap-3 text-sm">
                <Link href={`/?date=${prev}`} className="badge">Prev</Link>
                <Link href={`/?date=${todayKey}`} className="badge">Today</Link>
                <span className="text-sm font-medium">{dateKey}</span>
                <Link href={`/?date=${next}`} className="badge">Next</Link>
              </nav>
            </div>

            <section className="space-y-2">
              <h2 className="font-medium">Daily Goal</h2>
              <form action={async (fd) => {
                "use server";
                const calories = Number(fd.get("goal") ?? 0);
                await upsertGlobalDailyGoal(calories);
                const { revalidatePath } = await import("next/cache");
                revalidatePath(`/?date=${dateKey}`);
              }} className="flex items-center gap-2">
                <input name="goal" type="number" defaultValue={goal?.goalCalories ?? 0} className="input w-32" />
                <button type="submit" className="btn-primary">Save</button>
              </form>
            </section>

            <section className="space-y-2 mt-4">
              <h2 className="font-medium">Add Entry</h2>
              <form action={async (fd) => {
                "use server";
                const name = String(fd.get("name") ?? "").trim();
                const calories = Number(fd.get("calories") ?? 0);
                const foodItemId = String(fd.get("preset") || "");
                
                // Don't submit if name is empty and no preset is selected
                if (!name && !foodItemId) {
                  return; // Silently ignore invalid submission
                }
                
                try {
                  await addEntry(dateKey, name, calories, foodItemId || undefined);
                } catch (error) {
                  // Handle validation errors gracefully
                  console.error("Failed to add entry:", error);
                }
              }} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input name="name" placeholder="Food name (or select preset)" className="input" />
                <input name="calories" type="number" placeholder="Calories" className="input" />
                <select name="preset" className="select">
                  <option value="">Select preset (optional)</option>
                  {presets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.caloriesPerUnit})</option>
                  ))}
                </select>
                <button type="submit" className="btn-primary">Add</button>
              </form>
            </section>

            <section className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Entries</h2>
                <div className="text-sm text-neutral-500">Total: <span className="font-medium text-neutral-900 dark:text-neutral-100">{total}</span> cal</div>
              </div>
              <ul className="divide-y">
                {entries.map(e => (
                  <li key={e.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{e.name}</p>
                      <p className="text-sm text-gray-500">{e.calories} cal</p>
                    </div>
                    <form action={async () => { "use server"; await deleteEntry(e.id); }}>
                      <button className="btn-ghost text-red-600">Delete</button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="card">
          <div className="card-body space-y-2">
            <h2 className="font-medium">Manage Presets</h2>
            <form action={addFoodItem} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input name="name" placeholder="Name" className="input" />
              <input name="caloriesPerUnit" type="number" placeholder="Calories" className="input" />
              <button type="submit" className="btn-primary">Add Preset</button>
            </form>
            <div className="space-y-2">
              {presets.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <form action={async (fd) => {
                    "use server";
                    const name = String(fd.get("name") ?? "").trim();
                    const caloriesPerUnit = Number(fd.get("caloriesPerUnit") ?? 0);
                    await updateFoodItem(p.id, name, caloriesPerUnit);
                  }} className="flex items-center gap-2 flex-1">
                    <input name="name" defaultValue={p.name} className="input w-40" />
                    <input name="caloriesPerUnit" type="number" defaultValue={p.caloriesPerUnit} className="input w-28" />
                    <button type="submit" className="btn-ghost">Save</button>
                  </form>
                  <form action={async () => { "use server"; await deleteFoodPreset(p.id); }}>
                    <button className="btn-danger">Delete</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body flex items-center justify-between">
          <div>
            <div className="section-title">Daily Summary</div>
            <div className="text-sm text-neutral-500">Difference vs goal</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{total} cal</div>
            <div className={`text-sm ${diff >= 0 ? "text-emerald-600" : "text-red-600"}`}>{diff} cal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
