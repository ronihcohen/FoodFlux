"use server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/server-auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function requireUserId() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function addFoodItem(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "");
  const caloriesPerUnit = Number(formData.get("caloriesPerUnit") ?? "0");
  const schema = z.object({ name: z.string().min(1), caloriesPerUnit: z.number().int().min(0) });
  const parsed = schema.safeParse({ name, caloriesPerUnit });
  if (!parsed.success) throw new Error("Invalid input");
  await prisma.foodItem.create({ data: { userId, ...parsed.data } });
  revalidatePath("/");
}

export async function upsertGlobalDailyGoal(goalCalories: number) {
  const userId = await requireUserId();
  const schema = z.object({ goalCalories: z.number().int().min(0) });
  const parsed = schema.parse({ goalCalories });
  await prisma.dailyGoal.upsert({
    where: { userId },
    update: { goalCalories: parsed.goalCalories },
    create: { userId, goalCalories: parsed.goalCalories },
  });
}

export async function addEntry(dateKey: string, name: string, calories: number, foodItemId?: string) {
  const userId = await requireUserId();

  // Allow using preset to fill in missing fields
  let workingName = (name ?? "").trim();
  let workingCalories = Number.isFinite(calories) ? calories : 0;

  if (foodItemId && (!workingName || workingCalories === 0)) {
    const preset = await prisma.foodItem.findFirst({ where: { id: foodItemId, userId } });
    if (preset) {
      if (!workingName) workingName = preset.name;
      if (workingCalories === 0) workingCalories = preset.caloriesPerUnit;
    }
  }

  const schema = z.object({
    dateKey: z.string().min(8).max(10),
    name: z.string().min(1),
    calories: z.number().int().min(0),
    foodItemId: z.string().optional(),
  });

  const parsed = schema.parse({ dateKey, name: workingName, calories: workingCalories, foodItemId });

  await prisma.entry.create({
    data: { userId, ...parsed },
  });

  revalidatePath(`/?date=${parsed.dateKey}`);
}

export async function deleteEntry(entryId: string) {
  const userId = await requireUserId();
  const entry = await prisma.entry.findUnique({ where: { id: entryId } });
  if (!entry || entry.userId !== userId) throw new Error("Not found");
  await prisma.entry.delete({ where: { id: entryId } });
  revalidatePath(`/?date=${entry.dateKey}`);
}

export async function updateFoodItem(foodItemId: string, name: string, caloriesPerUnit: number) {
  const userId = await requireUserId();
  const schema = z.object({ id: z.string().min(1), name: z.string().min(1), caloriesPerUnit: z.number().int().min(0) });
  const parsed = schema.parse({ id: foodItemId, name, caloriesPerUnit });
  const existing = await prisma.foodItem.findUnique({ where: { id: parsed.id } });
  if (!existing || existing.userId !== userId) throw new Error("Not found");
  await prisma.foodItem.update({ where: { id: parsed.id }, data: { name: parsed.name, caloriesPerUnit: parsed.caloriesPerUnit } });
  revalidatePath("/");
}

export async function deleteFoodPreset(foodItemId: string) {
  const userId = await requireUserId();
  const schema = z.object({ id: z.string().min(1) });
  const { id } = schema.parse({ id: foodItemId });
  const existing = await prisma.foodItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) throw new Error("Not found");
  await prisma.foodItem.delete({ where: { id } });
  revalidatePath("/");
}


