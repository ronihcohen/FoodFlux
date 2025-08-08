import { format } from "date-fns";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/db";
import { addEntry, addFoodItem, upsertGlobalDailyGoal, deleteEntry, updateFoodItem, deleteFoodPreset } from "@/app/actions";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/signin");

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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">FoodFlux</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href={`/?date=${prev}`} className="underline">Prev</Link>
          <span>{dateKey}</span>
          <Link href={`/?date=${next}`} className="underline">Next</Link>
        </nav>
      </header>

      <section className="space-y-2">
        <h2 className="font-medium">Daily Goal</h2>
        <form action={async (fd) => {
          "use server";
          const calories = Number(fd.get("goal") ?? 0);
          await upsertGlobalDailyGoal(calories);
          const { revalidatePath } = await import("next/cache");
          revalidatePath(`/?date=${dateKey}`);
        }} className="flex items-center gap-2">
          <input name="goal" type="number" defaultValue={goal?.goalCalories ?? 0} className="border rounded px-2 py-1 w-32" />
          <button type="submit" className="px-3 py-1 rounded bg-black text-white">Save</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Add Entry</h2>
        <form action={async (fd) => {
          "use server";
          const name = String(fd.get("name") ?? "");
          const calories = Number(fd.get("calories") ?? 0);
          const foodItemId = String(fd.get("preset") || "");
          await addEntry(dateKey, name, calories, foodItemId || undefined);
        }} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input name="name" placeholder="Name" className="border rounded px-2 py-1" />
          <input name="calories" type="number" placeholder="Calories" className="border rounded px-2 py-1" />
          <select name="preset" className="border rounded px-2 py-1">
            <option value="">Preset (optional)</option>
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.caloriesPerUnit})</option>
            ))}
          </select>
          <button type="submit" className="px-3 py-1 rounded bg-black text-white">Add</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Entries</h2>
        <ul className="divide-y">
          {entries.map(e => (
            <li key={e.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-gray-500">{e.calories} cal</p>
              </div>
              <form action={async () => { "use server"; await deleteEntry(e.id); }}>
                <button className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Totals</h2>
        <p>Total: {total} cal</p>
        <p>Difference vs goal: {diff} cal</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Manage Presets</h2>
        <form action={addFoodItem} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input name="name" placeholder="Name" className="border rounded px-2 py-1" />
          <input name="caloriesPerUnit" type="number" placeholder="Calories" className="border rounded px-2 py-1" />
          <button type="submit" className="px-3 py-1 rounded bg-black text-white">Add Preset</button>
        </form>
        <div className="space-y-2">
          {presets.map(p => (
            <div key={p.id} className="flex items-center gap-2 border rounded p-2">
              <form action={async (fd) => {
                "use server";
                const name = String(fd.get("name") ?? "").trim();
                const caloriesPerUnit = Number(fd.get("caloriesPerUnit") ?? 0);
                await updateFoodItem(p.id, name, caloriesPerUnit);
              }} className="flex items-center gap-2 flex-1">
                <input name="name" defaultValue={p.name} className="border rounded px-2 py-1 w-40" />
                <input name="caloriesPerUnit" type="number" defaultValue={p.caloriesPerUnit} className="border rounded px-2 py-1 w-28" />
                <button type="submit" className="px-3 py-1 rounded bg-black text-white">Save</button>
              </form>
              <form action={async () => { "use server"; await deleteFoodPreset(p.id); }}>
                <button className="text-red-600">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
