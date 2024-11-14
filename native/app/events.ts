import { addAppEventListener } from "./App";

export function onAppResize(callback: () => void) {
  addAppEventListener("APP_RESIZE", callback);
}
