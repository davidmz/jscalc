import { batch, computed, effect, signal } from "@preact/signals";
import { isArray, isString } from "ts-json-check";

import { persistentSignal } from "../utils/persistentSignal";

export const $lines = persistentSignal(
  "code",
  ["2 + 2", "_ + 1"],
  isArray(isString)
);

$lines.value = [...$lines.value.map((l) => l.trim()).filter(Boolean), ""];

export const $results = signal<string[]>([]);
const $error = signal<string | null>(null);

export const $calc = computed(() =>
  $lines.value.map((code, idx) => ({
    code,
    result: $results.value[idx],
    error: idx === $results.value.length ? $error.value : null,
  }))
);

export const $activeLine = signal($lines.value.length - 1);

effect(() => {
  const workerCode = getWorkerCode($lines.value);
  const blob = new Blob([workerCode], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);

  worker.addEventListener(
    "message",
    (e) =>
      batch(() => {
        $results.value = e.data[0];
        $error.value = e.data[1];
      }),
    {
      once: true,
    }
  );
});

function getWorkerCode(lines: string[]): string {
  return `with(Math) {
    const __jsCalcResult = [];
    let _ = undefined;
    addEventListener("error", (e) => postMessage([__jsCalcResult, e.message]));
    ${lines
      .map(
        (line) =>
          `_ = eval(${JSON.stringify(
            line.replace(/(\d+),(\d+)/g, "$1.$2") || "undefined"
          )}); __jsCalcResult.push(_);`
      )
      .join("\n")}
    postMessage([__jsCalcResult, null]);
  }`;
}
