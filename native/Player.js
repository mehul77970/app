/**
 * Set the current player URL to a local or remote path
 * @param {string} url
 */

// Configure our handle for the player controller
const handle = window.go.player.Player

// Set the current url/path of the player controller
export function setURL(url) {
  handle.SetURL(url)
}

// Start the player
export function start() {
  handle.Start()
}
