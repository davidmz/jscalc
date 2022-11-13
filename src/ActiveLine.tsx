import { useCallback, useEffect, useRef } from "preact/hooks";

import style from "./ActiveLine.module.css";
import { keyboardHandler } from "./kbd-handler";

type Props = { code: string };

export function ActiveLine({ code }: Props) {
  const input = useRef<HTMLInputElement>(null);

  const focusIt = useCallback(() => input.current?.focus(), []);

  useEffect(() => {
    focusIt();
    const focusOnKey = (e: KeyboardEvent) =>
      !e.ctrlKey && !e.altKey && !e.metaKey && focusIt();

    document.addEventListener("focus", focusIt);
    document.addEventListener("keydown", focusOnKey);
    return () => {
      document.removeEventListener("focus", focusIt);
      document.removeEventListener("keydown", focusOnKey);
    };
  }, [focusIt]);

  return (
    <div class={style.box}>
      <input
        class={style.input}
        type="text"
        ref={input}
        value={code}
        onKeyDown={keyboardHandler}
      />
    </div>
  );
}
