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
