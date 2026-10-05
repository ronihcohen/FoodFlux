"use client";

import { useState, FormEvent } from "react";
import { addEntry } from "@/app/actions";

interface EstimateResult {
  calories: number;
  breakdown: Array<{ item: string; calories: number }>;
  confidence: string;
}

export default function AIFoodEntry({ dateKey }: { dateKey: string }) {
  const [description, setDescription] = useState("");
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  async function handleEstimate(e: FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    setIsEstimating(true);
    setError("");

    try {
      const res = await fetch("/api/estimate-calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to estimate calories");
      }

      setEstimate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to estimate");
    } finally {
      setIsEstimating(false);
    }
  }

  async function handleConfirm() {
    if (!estimate) return;

    setIsAdding(true);
    try {
      await addEntry(dateKey, description.trim(), estimate.calories);
      setDescription("");
      setEstimate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add entry");
    } finally {
      setIsAdding(false);
    }
  }

  function handleCancel() {
    setEstimate(null);
    setError("");
  }

  return (
    <div className="border rounded p-3">
      <h3 className="font-medium mb-2">AI Food Entry (Gemini)</h3>
      <p className="text-sm text-neutral-500 mb-3">
        Describe what you ate (e.g., &ldquo;2 bananas with milk&rdquo;)
      </p>

      <form onSubmit={handleEstimate} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., 2 bananas with milk, grilled chicken salad&hellip;"
            className="input flex-1"
            disabled={isEstimating || isAdding}
            aria-label="Food description"
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={isEstimating || !description.trim()}
          >
            {isEstimating ? "Estimating..." : "Estimate"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </div>
      )}

      {estimate && (
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Estimated: {estimate.calories} cal
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                estimate.confidence === "high"
                  ? "bg-emerald-100 text-emerald-700"
                  : estimate.confidence === "medium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {estimate.confidence} confidence
            </span>
          </div>

          {estimate.breakdown.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-neutral-600">
                Show breakdown
              </summary>
              <ul className="mt-1 space-y-1">
                {estimate.breakdown.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.item}</span>
                    <span className="font-medium">{item.calories} cal</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleConfirm}
              className="btn-primary flex-1"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Confirm & Add"}
            </button>
            <button
              onClick={handleCancel}
              className="btn-ghost flex-1"
              disabled={isAdding}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}