"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnknownMeal({ dateKey }: { dateKey: string }) {
  const [calories, setCalories] = useState<number>(50);
  const router = useRouter();

  function dec() {
    setCalories((c) => Math.max(50, c - 50));
  }
  function inc() {
    setCalories((c) => c + 50);
  }

  async function addUnknown() {
    try {
      const res = await fetch("/api/unknown-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateKey, calories }),
      });
      if (!res.ok) throw new Error("Failed to add");
      setCalories(50);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add unknown meal");
    }
  }

  return (
    <div className="border rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium">Quick Add: Unknown Meal</h3>
          <p className="text-sm text-neutral-500">Doesn&apos;t save to presets</p>
        </div>
        <div className="text-sm text-neutral-700">Min 50 cal</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          className="btn-ghost px-3 py-1"
          aria-label="Decrease calories"
        >
          -
        </button>

        <input
          type="number"
          min={50}
          value={calories}
          onChange={(e) => {
            const v = Number(e.target.value ?? 50);
            setCalories(Number.isNaN(v) ? 50 : Math.max(50, Math.round(v)));
          }}
          className="input text-center w-28"
          aria-label="Calories"
        />

        <button
          type="button"
          onClick={inc}
          className="btn-ghost px-3 py-1"
          aria-label="Increase calories"
        >
          +
        </button>

        <button onClick={addUnknown} className="btn-primary">
          Add
        </button>
      </div>
    </div>
  );
}
