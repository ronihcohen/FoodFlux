"use server";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function requireUserId() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function addFoodItem(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const caloriesPerUnit = Number(formData.get("caloriesPerUnit") ?? "0");
  
  if (!name || caloriesPerUnit < 0) throw new Error("Invalid input");
  
  await prisma.foodItem.create({ data: { userId, name, caloriesPerUnit } });
  revalidatePath("/");
}

export async function upsertGlobalDailyGoal(goalCalories: number) {
  const userId = await requireUserId();
  
  if (goalCalories < 0) throw new Error("Goal calories must be non-negative");
  
  await prisma.dailyGoal.upsert({
    where: { userId },
    update: { goalCalories },
    create: { userId, goalCalories },
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

  // If we still don't have a name after trying to use preset, throw a more descriptive error
  if (!workingName) {
    throw new Error("Food name is required. Please enter a name or select a preset.");
  }

  // Validate inputs
  if (!dateKey || dateKey.length < 8 || dateKey.length > 10) {
    throw new Error("Invalid date key");
  }
  if (!workingName) {
    throw new Error("Food name is required");
  }
  if (workingCalories < 0) {
    throw new Error("Calories must be non-negative");
  }

  await prisma.entry.create({
    data: { userId, dateKey, name: workingName, calories: workingCalories, foodItemId },
  });

  revalidatePath(`/?date=${dateKey}`);
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
  
  if (!foodItemId || !name.trim() || caloriesPerUnit < 0) {
    throw new Error("Invalid input");
  }
  
  const existing = await prisma.foodItem.findUnique({ where: { id: foodItemId } });
  if (!existing || existing.userId !== userId) throw new Error("Not found");
  await prisma.foodItem.update({ 
    where: { id: foodItemId }, 
    data: { name: name.trim(), caloriesPerUnit } 
  });
  revalidatePath("/");
}

export async function deleteFoodPreset(foodItemId: string) {
  const userId = await requireUserId();
  
  if (!foodItemId) {
    throw new Error("Invalid food item ID");
  }
  
  const existing = await prisma.foodItem.findUnique({ where: { id: foodItemId } });
  if (!existing || existing.userId !== userId) throw new Error("Not found");
  await prisma.foodItem.delete({ where: { id: foodItemId } });
  revalidatePath("/");
}


