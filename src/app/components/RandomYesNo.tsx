"use client";
import { useState } from "react";

export default function RandomYesNo() {
  const [result, setResult] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);
  const [changed, setChanged] = useState<boolean | null>(null);

  // simple transient highlight flag when asking
  const [flash, setFlash] = useState(false);

  function ask() {
    const next = Math.random() < 0.5 ? "Yes" : "No";
    setPrev(result);
    setResult(next);
    setChanged(result === null ? null : next !== result);

    // trigger a brief flash so the user knows a new draw happened
    setFlash(true);
    window.setTimeout(() => setFlash(false), 400);
  }

  return (
    <div className="card w-full">
      <div className="card-body flex items-center justify-between">
        <div>
          <h3 className="font-medium">Decide</h3>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`text-xl font-semibold transition-opacity duration-200 ${
              flash ? "opacity-80" : "opacity-100"
            }`}
          >
            {result ?? "-"}
          </div>
          <div className="text-sm text-neutral-500 text-right">
            <div>Prev: {prev ?? "-"}</div>
            <div>
              {changed === null ? (
                ""
              ) : changed ? (
                <span className="text-emerald-600">Changed</span>
              ) : (
                <span className="text-red-600">Unchanged</span>
              )}
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
