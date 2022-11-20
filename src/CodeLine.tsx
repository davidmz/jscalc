import { useMemo } from "preact/hooks";
import Prism, { type TokenStream } from "prismjs";

import calcStyle from "./Calc.module.css";
import style from "./CodeLine.module.css";
import { $activeLine } from "./stores/calc";

Prism.manual = true;

type Props = { children: string; index: number };

export function CodeLine({ children: code, index }: Props) {
  const tokens = useMemo(
    () => Prism.tokenize(code, Prism.languages.javascript),
    [code]
  );

  return (
    <div class={calcStyle.code} onClick={() => ($activeLine.value = index)}>
      <ParsedCode>{tokens}</ParsedCode>
    </div>
  );
}

const withDataType = false; // turn it on for debug

function ParsedCode({
  children: tokens,
  type,
}: {
  children: TokenStream;
  type?: string;
}) {
  if (typeof tokens === "string") {
    return (
      <span
        class={style[type || "text"]}
        data-type={withDataType ? type || "text" : undefined}
      >
        {tokens}
      </span>
    );
  } else if (!Array.isArray(tokens)) {
    return <ParsedCode type={tokens.type}>{tokens.content}</ParsedCode>;
  } else if (type) {
    <span class={style[type]} data-type={withDataType ? type : undefined}>
      {tokens.map((t) => (
        <ParsedCode>{t}</ParsedCode>
      ))}
    </span>;
  }
  return (
    <>
      {tokens.map((t) => (
        <ParsedCode>{t}</ParsedCode>
      ))}
    </>
  );
}
