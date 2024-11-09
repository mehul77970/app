/**
 * Equivalent to eventEmitter.on
 * @param {any} eventName
 * @param {(any) => void} callback
 * @param {number} maxCallbacks
 */
export function onMany(eventName, callback, maxCallbacks) {
  return window.runtime.EventsOnMultiple(eventName, callback, maxCallbacks)
}

/**
   * Equivalent to eventEmitter.on
   * @param {any} eventName
   * @param {(any) => void} callback
   */
export function on(eventName, callback) {
  return onMany(eventName, callback, -1)
}

/**
   * Equivalent to eventEmitter.stop
   * @param {any} eventName
   */
export function stop(eventName, ...additionalEventNames) {
  return window.runtime.EventsOff(eventName, ...additionalEventNames)
}

/**
   * Equivalent to eventEmitter.once
   * @param {any} eventName
   * @param {(any) => void} callback
   */
export function once(eventName, callback) {
  return onMany(eventName, callback, 1)
}
