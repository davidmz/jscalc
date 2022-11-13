import {
  applyAndInsertNext,
  applyAndInsertPrev,
  applyAndNext,
  applyAndPrev,
  copyPrevResult,
  moveActiveLineToEnd,
  moveActiveLineToStart,
  removeActiveLine,
} from "./stores/actions";

const brackets = {
  "(": ")",
  "{": "}",
  "[": "]",
  "'": "'",
  '"': '"',
  "`": "`",
};

export function keyboardHandler(e: KeyboardEvent) {
  const input = e.target as HTMLInputElement;
  const val = input.value.trim() || "";
  if (e.key === "Enter" || e.key === "ArrowDown") {
    e.preventDefault();
    e.shiftKey ? applyAndInsertNext(val) : applyAndNext(val);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    e.shiftKey ? applyAndInsertPrev(val) : applyAndPrev(val);
  } else if (e.key === "End" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    moveActiveLineToEnd();
  } else if (e.key === "Home" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    moveActiveLineToStart();
  } else if (e.key === "Backspace") {
    if (val === "") {
      e.preventDefault();
      removeActiveLine();
    } else if (e.shiftKey) {
      input.value = "";
    }
  } else if (e.code === "KeyC" && (e.ctrlKey || e.metaKey)) {
    copyPrevResult();
  } else if (e.key in brackets) {
    // Surround selection by brackets
    const st = e.key as keyof typeof brackets;
    const { selectionStart: start, selectionEnd: end } = input;
    if (start !== null && end !== null && start !== end) {
      e.preventDefault();
      const text = input.value.slice(start, end);
      const before = input.value.slice(0, start);
      const after = input.value.slice(end);
      const newText = st + text + brackets[st];
      input.value = before + newText + after;
      input.selectionStart = start + st.length;
      input.selectionEnd = end + st.length;
    }
  }
}
