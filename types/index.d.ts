import type HLS from 'hls.js'

declare global {
  interface Window {
    SECRET_PLAYER_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: HLS
    chrome: {
      app: unknown
    }
    opr: unknown
    opera: unknown
  }

  interface opr {
    addons: unknown
  }
}
