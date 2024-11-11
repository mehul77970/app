// Configure our handle for the config controller
const handle = window?.go?.config?.Config

/**
 * Im too lazy to add proper typing...
 * @typedef ConfigData
 * @prop {any} authentication
 * @prop {any} server
 * @prop {any} user
 */

export function Read() {
  handle.Read()
}

// Request to exit fullscreen
export function Write() {
  handle.Write()
}

/** Get config data from backend
* @returns {ConfigData} Config data
*/
export async function getData() {
  return await handle.GetData()
}
/**
 * Set authentication on backend
 * @param {any} store
 */
export function setAuthentication(store) {
  handle.SetAuthentication(store)
}

/**
 * Set server on backend
 * @param {any} store
 */
export function setServer(store) {
  handle.SetServer(store)
}

/**
 * Set user on backend
 * @param {any} store
 */
export function setUser(store) {
  handle.SetUser(store)
}
