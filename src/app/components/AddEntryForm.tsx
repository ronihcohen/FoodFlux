"use client";

import { useState } from "react";
import { addEntry, addFoodItem } from "@/app/actions";

interface FoodItem {
    id: string;
    name: string;
    caloriesPerUnit: number;
}

interface AddEntryFormProps {
    dateKey: string;
    presets: FoodItem[];
}

type InputMode = "quantity" | "weight";

export default function AddEntryForm({ dateKey, presets }: AddEntryFormProps) {
    const [inputMode, setInputMode] = useState<InputMode>("quantity");
    const [selectedPresetId, setSelectedPresetId] = useState<string>("");
    const [name, setName] = useState("");
    const [calories, setCalories] = useState<number | "">("");
    const [quantity, setQuantity] = useState<number | "">(1);

    // When preset changes, update fields
    const handlePresetChange = (presetId: string) => {
        setSelectedPresetId(presetId);
        const preset = presets.find((p) => p.id === presetId);
        if (preset) {
            if (!name) setName(preset.name); // Only auto-fill name if empty (optional, matched existing behavior roughly) -- actually existing allowed overriding.
            // Better: if preset selected, we might want to fill name but user can edit. 
            // The previous form used a select and separate inputs. 

            // Let's mimic previous behavior: presetting fills values if they are empty? 
            // Actually previous form Logic: 
            // "Allow using preset to fill in missing fields" (server side).
            // Client side just had separate inputs.

            // But for better UX, let's auto-fill calories.
            setCalories(preset.caloriesPerUnit);
            // If we switch presets, we probably want to use the new preset's name if the current name matches the old preset or is empty.
            // For simplicity, let's just fill calories.
        }
    };

    async function handleSubmit() {
        // We'll calculate manually to ensure correct mode logic, then call server action
        // But we can also just use the form data if we structure it right.
        // However, the `addEntry` action expects total calories or uses preset.

        // Let's do the calculation here and pass the final values to `addEntry`.

        const submittedName = name.trim();
        const submittedCalories = Number(calories) || 0;
        const submittedQuantity = Number(quantity) || 1;

        let finalCalories = 0;
        let finalName = submittedName;
        const preset = presets.find(p => p.id === selectedPresetId);

        // If preset is selected and we want to rely on its values:
        // Note: If user edited the calories input, we should probably use that instead of preset's default?
        // In this form, let's assume the input field is the truth.
        const effectiveCalories = submittedCalories; // The input field value

        if (inputMode === "quantity") {
            finalCalories = effectiveCalories * submittedQuantity;
            if (submittedQuantity > 1) {
                finalName = `${submittedName} (${submittedQuantity})`;
            }
        } else {
            // Weight mode: quantity is "units of 100g" (e.g. 3.5)
            // Calories is "per 100g"
            finalCalories = effectiveCalories * submittedQuantity;
            // e.g. 3.5 * 350 = 1225
            // Name formatting for weight?
            const weightInGrams = submittedQuantity * 100;
            finalName = `${submittedName} (${weightInGrams}g)`;
        }

        // Server action `addEntry` takes (dateKey, name, calories, foodItemId)

        // We need to handle the "save new preset" logic if it's a new item.
        // The original page.tsx had logic: "if name && !foodItemId ... addFoodItem".
        // We should preserve that check or handle it.

        // Since `addEntry` is a server action, let's try to keep as much logic there or wrap it here.
        // But `addEntry` logic regarding partials was complex.
        // Ideally we pass the FINAL calculated calories to `addEntry`.

        try {
            await addEntry(dateKey, finalName, finalCalories, selectedPresetId || undefined);

            // Check if we need to save a new preset (if name provided, no preset selected, and doesn't exist)
            if (submittedName && !selectedPresetId) {
                const exists = presets.some(p => p.name.toLowerCase() === submittedName.toLowerCase());
                if (!exists) {
                    const fd = new FormData();
                    fd.set("name", submittedName);
                    // If in weight mode, the preset should store the total calculated calories, so it acts like a fixed portion item next time.
                    // If in quantity mode, it stores the per-unit calories.
                    const caloriesToSave = inputMode === "weight" ? finalCalories : effectiveCalories;
                    fd.set("caloriesPerUnit", String(caloriesToSave));
                    await addFoodItem(fd);
                }
            }

            // Reset form
            setName("");
            setCalories("");
            setQuantity(1);
            setSelectedPresetId("");
            // Optional: revert mode or keep it.

        } catch (e) {
            console.error("Error adding entry", e);
            // In a real app, show toast
        }
    }

    return (
        <section className="space-y-2 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Add Entry</h2>
                <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 text-xs font-medium">
                    <button
                        type="button"
                        onClick={() => setInputMode("quantity")}
                        className={`px-3 py-1 rounded-md transition-all ${inputMode === "quantity" ? "bg-white dark:bg-neutral-700 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                    >
                        Quantity
                    </button>
                    <button
                        type="button"
                        onClick={() => setInputMode("weight")}
                        className={`px-3 py-1 rounded-md transition-all ${inputMode === "weight" ? "bg-white dark:bg-neutral-700 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                    >
                        Weight (100g)
                    </button>
                </div>
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Food name"
                    className="input sm:col-span-1"
                />

                <select
                    value={selectedPresetId}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="select sm:col-span-1"
                >
                    <option value="">Select preset...</option>
                    {presets.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} ({p.caloriesPerUnit})
                        </option>
                    ))}
                </select>

                <input
                    name="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={inputMode === "quantity" ? "Calories" : "Cals / 100g"}
                    className="input sm:col-span-1"
                />

                <input
                    name="quantity"
                    type="number"
                    step="any"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={inputMode === "quantity" ? "Qty" : "Units (3.5 = 350g)"}
                    className="input sm:col-span-1"
                />

                <button type="submit" className="btn-primary sm:col-span-1">
                    Add
                </button>
            </form>
        </section>
    );
}
