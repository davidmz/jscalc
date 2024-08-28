import { ActiveLine } from "./ActiveLine";
import style from "./Calc.module.css";
import { CodeLine } from "./CodeLine";
import { $activeLine, $calc } from "./stores/calc";
import { cn } from "./utils/cn";

export function Calc() {
  const activeLine = $activeLine.value;
  let errorLine = $calc.value.findIndex((it) => it.error !== null);
  if (errorLine === -1) {
    errorLine = Infinity;
  }
  return (
    <ol class={style.lines}>
      {$calc.value.map(({ code, result, error }, idx, lines) => {
        return (
          <li
            class={cn(
              style.line,
              idx === lines.length - 1 && style.lastLine,
              idx > errorLine && style.lineAfterError,
            )}
          >
            {idx === activeLine ? (
              <ActiveLine code={code} />
            ) : (
              <CodeLine index={idx}>{code}</CodeLine>
            )}

            {error !== null ? (
              <div class={style.error}>{error}</div>
            ) : (
              <div class={style.result}>
                <span class={style.equal}>{"= "}</span>
                <span class={style.resultValue}>
                  {result !== undefined && JSON.stringify(result)}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
