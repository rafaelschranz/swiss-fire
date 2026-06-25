"use client";

import type { StepDef } from "@/components/wizard/steps";

export function StepProgress({
  steps,
  current,
  onJump,
  progressAria,
}: {
  steps: StepDef[];
  current: number;
  onJump: (index: number) => void;
  progressAria: string;
}) {
  return (
    <ol className="flex items-center" aria-label={progressAria}>
      {steps.map((step, i) => {
        const state = i === current ? "current" : i < current ? "done" : "upcoming";
        const reachable = i <= current;
        return (
          <li key={step.id} className="flex flex-1 items-center">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onJump(i)}
              aria-current={state === "current" ? "step" : undefined}
              className={`num flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-medium transition ${
                state === "current"
                  ? "border-ink bg-ink text-paper"
                  : state === "done"
                    ? "border-ink bg-ink text-paper hover:opacity-80"
                    : "border-line-2 bg-transparent text-muted"
              } ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
              title={step.title}
            >
              {state === "done" ? "✓" : String(i + 1).padStart(2, "0")}
            </button>
            {i < steps.length - 1 && (
              <span className={`mx-2 h-px flex-1 transition ${i < current ? "bg-ink" : "bg-line-2"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
