import style from "./App.module.css";
import { Calc } from "./Calc";
import { Header } from "./Header";

export function App() {
  return (
    <div class={style.app}>
      <Header />
      <Calc />
    </div>
  );
}
