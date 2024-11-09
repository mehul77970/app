import { on, stop } from '../listener'
// Configure our handle for the app controller
const handle = window?.go?.main?.App

// Set the app to fullscreen
export function fullscreen() {
  handle.Fullscreen()
}

// Request to exit fullscreen
export function exitFullscreen() {
  handle.UnFullscreen()
}

/**
 * Create a listener that expires after the component is disposed of
 * @param {import("./types").AppEvents} name
 * @param {(any) => void} callback
 */
export function addAppEventListener(name, fn) {
  on(name, fn)
  if (getCurrentScope()) {
    onScopeDispose(() => stop(name))
  }
}
