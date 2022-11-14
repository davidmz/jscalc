import { batch } from "@preact/signals";

import { $activeLine, $lines, $results } from "./calc";

export function copyPrevResult() {
  const prevRes = $results.value[$activeLine.value - 1];
  if (prevRes) {
    navigator.clipboard.writeText(prevRes);
    // TODO Handle success/error and indicate it
  }
}

export function applyAndNext(s: string) {
  const isLastLine = $lines.value.length - 1 === $activeLine.value;
  const lines = $lines.value.slice();
  let activeLine = $activeLine.value;
  if (s === "") {
    if (!isLastLine) {
      lines.splice($activeLine.value, 1);
      $lines.value = lines;
    }
  } else {
    lines[$activeLine.value] = s;
    isLastLine && lines.push("");
    activeLine++;
  }

  batch(() => {
    $activeLine.value = activeLine;
    $lines.value = lines;
  });
}

export function applyAndInsertNext(s: string) {
  if (s === "") {
    return;
  }
  const lines = $lines.value.slice();
  let activeLine = $activeLine.value;

  lines[activeLine] = s;
  activeLine++;
  lines.splice(activeLine, 0, "");

  batch(() => {
    $activeLine.value = activeLine;
    $lines.value = lines;
  });
}

export function applyAndPrev(s: string) {
  const isFirstLine = $activeLine.value === 0;
  const isLastLine = $lines.value.length - 1 === $activeLine.value;
  const lines = $lines.value.slice();
  let activeLine = $activeLine.value;
  if (s === "") {
    if (isFirstLine) {
      return;
    } else if (!isLastLine) {
      lines.splice(activeLine, 1);
    }
    activeLine--;
  } else if (!isFirstLine) {
    lines[activeLine] = s;
    if (isLastLine) {
      lines.push("");
    }
    activeLine--;
  }
  batch(() => {
    $activeLine.value = activeLine;
    $lines.value = lines;
  });
}

export function applyAndInsertPrev(s: string) {
  if (s === "") {
    return;
  }
  const lines = $lines.value.slice();
  const activeLine = $activeLine.value;

  lines[activeLine] = s;
  lines.splice(activeLine, 0, "");

  batch(() => {
    $activeLine.value = activeLine;
    $lines.value = lines;
  });
}

export function removeActiveLine() {
  const isFirstLine = $activeLine.value === 0;
  const isLastLine = $lines.value.length - 1 === $activeLine.value;
  const lines = $lines.value.slice();
  let activeLine = $activeLine.value;
  if (isLastLine) {
    lines[activeLine] = "";
  } else {
    lines.splice(activeLine, 1);
  }
  if (!isFirstLine) {
    activeLine--;
  }
  batch(() => {
    $activeLine.value = activeLine;
    $lines.value = lines;
  });
}

export function moveActiveLineToStart() {
  $activeLine.value = 0;
}

export function moveActiveLineToEnd() {
  $activeLine.value = $lines.value.length - 1;
}

export function clearCode() {
  batch(() => {
    $activeLine.value = 0;
    $lines.value = [""];
  });
}
