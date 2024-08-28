import { type Signal, effect, signal } from "@preact/signals";
import { type Guard } from "ts-json-check";

let supported = false;
try {
  supported = typeof localStorage !== "undefined";
} catch (e) {
  // Privacy mode, localStorage is not supported
}

export function persistentSignal<T>(
  key: string,
  initial: T,
  isValidType: Guard<T>,
): Signal<T> {
  const sig = signal(initial);
  if (!supported) {
    return sig;
  }

  const updateFromSaved = (encoded: string | null) => {
    if (encoded !== null) {
      try {
        const v = JSON.parse(encoded);
        if (isValidType(v)) {
          sig.value = v;
          return;
        }
      } catch (_) {
        // invalid JSON
      }
    }
    sig.value = initial;
  };
  updateFromSaved(localStorage.getItem(key));

  effect(() => localStorage.setItem(key, JSON.stringify(sig.value)));
  globalThis.addEventListener("storage", (e) => {
    if (e.key !== key) {
      return;
    }
    updateFromSaved(e.newValue);
  });

  return sig;
}
