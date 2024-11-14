import { getCurrentScope, onScopeDispose } from "vue";
import { on, stop } from "../listener";
// Configure our handle for the app controller
const handle = window?.go?.main?.App;

// Set the app to fullscreen
export function fullscreen() {
  handle.Fullscreen();
}

// Request to exit fullscreen
export function exitFullscreen() {
  handle.UnFullscreen();
}

/**
 * Set RGB background of parent app
 * @param {number} r Red
 * @param {number} g Green
 * @param {number} b Blue
 */
export function setBackground(r, g, b) {
  handle.SetBackground(r, g, b);
}
/**
 * Create a listener that expires after the component is disposed of
 * @param {import("./types").AppEvents} name app event
 * @param {(any) => void} fn callback
 */
export function addAppEventListener(name, fn) {
  on(name, fn);
  if (getCurrentScope()) {
    onScopeDispose(() => stop(name));
  }
}
