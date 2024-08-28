import style from "./App.module.css";
import { AppUpdated } from "./AppUpdated";
import { Calc } from "./Calc";
import { Header } from "./Header";

export function App() {
  return (
    <div class={style.app}>
      <AppUpdated />
      <Header />
      <Calc />
    </div>
  );
}
