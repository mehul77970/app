// Configure our handle for the player controller
const handle = window?.go?.player?.Player

/**
 * Set the current player URL to a local or remote path
 * @param {string} url
 */
export async function setURL(url) {
  handle.SetURL(url)
}

/**
 * Set the position for the player to start at
 * @param {number} position_sec where to start the player in seconds
 */
export async function setStartPosition(position_sec) {
  await handle.SetStartPosition(position_sec)
}

/**
 * Start/create the player and allocate the memory to begin playback
 */
export async function start() {
  await handle.Start()
}

// Destroy/Stop the player, and clean up resources
export async function destroy() {
  await handle.Destroy()
}

/**
 * Pause or unpause the player
 * @param {boolean} paused Pause or unpause the player
 */
export async function setPlayerPause(paused) {
  await handle.SetPlayerPause(paused)
}

/**
 * Set player position
 * @param {number} position_sec Position in seconds
 */
export async function setPlayerPosition(position_sec) {
  await handle.SetPlayerPosition(position_sec)
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

/**
 * Create a listener that expires after the component is disposed of
 * @param {import("./types").EventTypes} name
 * @param {(any) => void} callback
 */
export function addPlayerEventListener(name, fn) {
  on(name, fn)
  if (getCurrentScope()) {
    onScopeDispose(() => stop(name))
  }
}
