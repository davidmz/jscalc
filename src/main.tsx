import { render } from "preact";

import { App } from "./App";

const root = document.getElementById("app");
if (root) {
  root.innerHTML = "";
  render(<App />, root as HTMLElement);
}
