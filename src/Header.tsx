import style from "./Header.module.css";
import { clearCode } from "./stores/actions";

export function Header() {
  return (
    <header class={style.header}>
      <div class={style.title}>JSCalc</div>
      <div class={style.actions}>
        <a onClick={doClear}>Clear</a>
        {" | "}
        <a href="https://github.com/davidmz/jscalc#readme" target="_blank">
          About
        </a>
        {" | "}
        <a href="https://ko-fi.com/U6U6GCQ9N" target="_blank">
          Sponsor<span class={style.linkIcon}>☕</span>
        </a>
      </div>
    </header>
  );
}

function doClear() {
  if (confirm("Are you sure to remove all code?")) {
    clearCode();
  }
}
