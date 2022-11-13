import { ActiveLine } from "./ActiveLine";
import style from "./Calc.module.css";
import { $activeLine, $calc } from "./stores/calc";

export function Calc() {
  const activeLine = $activeLine.value;
  return (
    <ol class={style.lines}>
      {$calc.value.map(({ code, result, error }, idx) => (
        <li class={style.line}>
          <div class={style.code} onClick={() => ($activeLine.value = idx)}>
            {idx === activeLine ? <ActiveLine code={code} /> : code}
          </div>

          {result !== undefined && (
            <div class={style.result}>
              <span class={style.equal}>{"= "}</span>
              {JSON.stringify(result)}
            </div>
          )}
          {error !== null && <div class={style.error}>{error}</div>}
        </li>
      ))}
    </ol>
  );
}
