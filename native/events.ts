import { on } from './Player'

// Called when the player is paused
export function onPlayerPause(callback: () => void) {
  on('PLAYER_PAUSE', callback)
}

// Called when the player has loaded and begun playing
export function onPlayerLoaded(callback: (duration_sec: number) => void) {
  on('PLAYER_LOADED', callback)
}

// Called when the player is sending logs/info messages
export function onPlayerMessage(callback: (message: string) => void) {
  on('PLAYER_MESSAGE', callback)
}

// Called when the player encounters an error that doesn't have a special handler
export function onPlayerGenericError(callback: (error: string) => void) {
  on('PLAYER_GENERIC_ERROR', callback)
}
