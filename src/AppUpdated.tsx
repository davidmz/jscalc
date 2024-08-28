import { useRegisterSW } from "virtual:pwa-register/preact";

import style from "./AppUpdated.module.css";

const intervalMS = 20 * 60 * 1000; // 20 minutes

export function AppUpdated() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      r && setInterval(() => r.update(), intervalMS);
    },
  });

  return needRefresh ? (
    <div class={style.appUpdated}>
      The app has update!{" "}
      <button class={style.reloadBtn} onClick={() => updateServiceWorker()}>
        Reload
      </button>{" "}
      it when you are ready
    </div>
  ) : null;
}
