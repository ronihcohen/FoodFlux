"use client";
import { useState } from "react";

export default function RandomYesNo() {
  const [result, setResult] = useState<string | null>(null);

  // simple transient highlight flag when asking
  const [flash, setFlash] = useState(false);
  const [flashType, setFlashType] = useState<"changed" | "unchanged" | "first" | null>(null);

  function ask() {
    const next = Math.random() < 0.5 ? "Yes" : "No";
    setResult(next);

    // set flash type for color feedback
    if (result === null) setFlashType("first");
    else setFlashType(next !== result ? "changed" : "unchanged");

    // trigger a brief flash so the user knows a new draw happened
    setFlash(true);
    window.setTimeout(() => {
      setFlash(false);
      setFlashType(null);
    }, 2500);
  }

  return (
    <div className="card w-full">
      <div className="card-body flex items-center justify-between">
        <div>
          <h3 className="font-medium">Decide</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div
              role="status"
              aria-live="polite"
              className={`text-xl font-semibold px-3 py-1 rounded-md transition-transform duration-300 inline-block transform ${
                flash
                  ? flashType === "changed"
                    ? "bg-emerald-100 text-emerald-800 scale-110 shadow-lg"
                    : flashType === "unchanged"
                    ? "bg-red-100 text-red-800 scale-110 shadow-lg"
                    : "bg-neutral-100 text-neutral-900 scale-105 shadow-md"
                  : "bg-transparent text-neutral-900"
              }`}
            >
              {result ?? "-"}
            </div>
          </div>
          <button onClick={ask} className="btn-primary">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
