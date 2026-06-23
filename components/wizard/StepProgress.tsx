"use client";

import type { StepDef } from "@/components/wizard/steps";

export function StepProgress({
  steps,
  current,
  onJump,
}: {
  steps: StepDef[];
  current: number;
  onJump: (index: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2" aria-label="Fortschritt">
      {steps.map((step, i) => {
        const state = i === current ? "current" : i < current ? "done" : "upcoming";
        const reachable = i <= current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onJump(i)}
              aria-current={state === "current" ? "step" : undefined}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                state === "current"
                  ? "bg-sky-600 text-white ring-4 ring-sky-600/20"
                  : state === "done"
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800"
              } ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
              title={step.title}
            >
              {state === "done" ? "✓" : i + 1}
            </button>
            {i < steps.length - 1 && (
              <span
                className={`h-0.5 flex-1 rounded-full transition ${
                  i < current ? "bg-sky-600" : "bg-zinc-200 dark:bg-zinc-800"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
