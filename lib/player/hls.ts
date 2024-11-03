import {
  default as HLS /* eslint-disable-line */,
  type HlsConfig,
} from 'hls.js'

import type { ShaddyPlayer } from '.'

export class HLSPlayer implements ShaddyPlayer {
  hls: HLS
  constructor(config: HlsConfig) {
    this.hls = new HLS(config)
  }

  load(url: string) {
    this.hls.loadSource(url)
  }
}
