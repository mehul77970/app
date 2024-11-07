/**
 * Set the current player URL to a local or remote path
 * @param {string} url
 */

// Configure our handle for the player controller
const handle = window?.go?.player?.Player

// Set the current url/path of the player controller
export async function setURL(url) {
  handle.SetURL(url)
}

// Start the player
export async function start() {
  await handle.Start()
}

/**
 * Pause or unpause the player
 * @param {boolean} paused Pause or unpause the player
 */
export async function setPlayerPause(paused) {
  await handle.SetPlayerPaused(paused)
}
/**
 * Equivalent to eventEmitter.on
 * @param {import("./types").EventTypes} eventName
 * @param {(any) => void} callback
 * @param {number} maxCallbacks
 */
export function onMany(eventName, callback, maxCallbacks) {
  return window.runtime.EventsOnMultiple(eventName, callback, maxCallbacks)
}

/**
 * Equivalent to eventEmitter.on
 * @param {import("./types").EventTypes} eventName
 * @param {(any) => void} callback
 */
export function on(eventName, callback) {
  return onMany(eventName, callback, -1)
}

/**
 * Equivalent to eventEmitter.stop
 * @param {import("./types").EventTypes} eventName
 * @param {import("./types").EventTypes} additionalEventNames
 */
export function stop(eventName, ...additionalEventNames) {
  return window.runtime.EventsOff(eventName, ...additionalEventNames)
}

/**
 * Equivalent to eventEmitter.once
 * @param {import("./types").EventTypes} eventName
 * @param {(any) => void} callback
 */
export function once(eventName, callback) {
  return onMany(eventName, callback, 1)
}
