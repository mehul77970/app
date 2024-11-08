import { on } from './Player'

// Called when the player is paused
export function onPlayerPause(callback: () => void) {
  on('PLAYER_PAUSE', callback)
}

// Called when the player has loaded and begun playing
export function onPlayerLoaded(callback: (duration_sec: number) => void) {
  on('PLAYER_LOADED', callback)
}

// Called when the player needs to start loading again
export function onPlayerLoading(callback: () => void) {
  on('PLAYER_LOADING', callback)
}

// Called when the player is sending logs/info messages
export function onPlayerMessage(callback: (message: string) => void) {
  on('PLAYER_MESSAGE', callback)
}

// Called when the player encounters an error that doesn't have a special handler
export function onPlayerGenericError(callback: (error: string) => void) {
  on('PLAYER_GENERIC_ERROR', callback)
}

// Called when the player position changes
export function onPlayerPosition(callback: (position_sec: number) => void) {
  on('PLAYER_POSITION', callback)
}

// Called when the player the player seeks (usually) or resolved network trouble
export function onPlayerPlaybackRestart(callback: () => void) {
  on('PLAYER_PLAYBACK_RESTART', callback)
}
