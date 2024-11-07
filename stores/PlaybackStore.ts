import { defineStore } from 'pinia'
import type { PlaybackInfoResponse } from '@jellyfin/sdk/lib/generated-client'
import type HLS from 'hls.js'
import { useApiFetch } from '#imports'

export interface PlaybackInfoOptions {
  isPlayback?: boolean
  autoOpenLivestream?: boolean
  maxStreamingBitrate?: number
  audioIndex?: number
  videoIndex?: number
  subtitleIndex?: number
  last?: string
}

export const usePlaybackStore = defineStore('playback', {
  state: () => ({
    info: null as null | PlaybackInfoResponse,
    lastPlaybackInfo: undefined as undefined | string,
    _transcodingUrl: null as null | URL,
  }),

  getters: {
    transcodingUrl(): string {
      if (!this._transcodingUrl) return 'NA'

      return this._transcodingUrl?.href
    },

    player(): HLS | undefined {
      if (import.meta.server) return

      return window.SECRET_PLAYER_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    },
  },

  actions: {
    setPlayer(player: HLS) {
      if (import.meta.server) return

      window.SECRET_PLAYER_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = player
    },

    clearPlayer() {
      if (import.meta.server) return

      window.SECRET_PLAYER_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        = undefined
    },

    // TODO: Improve this function and calling
    async getPlaybackInfo(
      id: string,
      options: PlaybackInfoOptions = {
        isPlayback: true,
        autoOpenLivestream: true,
        maxStreamingBitrate: useDeviceStore().bitrate,
        audioIndex: undefined,
        videoIndex: undefined,
        subtitleIndex: undefined,
        last: undefined,
      },
    ): Promise<PlaybackInfoResponse> {
      const server = useServerStore()
      const authentication = useAuthenticationStore()
      const device = useDeviceStore()

      const url = new URL(
        options.last ? options.last : `${server.url}/Items/${id}/PlaybackInfo`,
      )

      if (options.isPlayback) {
        url.searchParams.set('isPlayback', 'true')
      }

      if (options.autoOpenLivestream) {
        url.searchParams.set('autoOpenLivestream', 'true')
      }

      if (options.maxStreamingBitrate) {
        url.searchParams.set('VideoBitrate', options.maxStreamingBitrate.toString())
      }

      if (options.audioIndex) {
        url.searchParams.set('AudioStreamIndex', options.audioIndex.toString())
      }

      if (options.subtitleIndex) {
        url.searchParams.set('SubtitleStreamIndex', options.subtitleIndex.toString())
      }

      if (options.videoIndex) {
        url.searchParams.set('VideoStreamIndex', options.videoIndex.toString())
      }

      const data = await useApiFetch<PlaybackInfoResponse>(
        url.href,
        {
          method: 'POST',
          headers: {
            Authorization: authentication.header,
          },
          body: { DeviceProfile: device.profile },
        },
        true,
      )

      this.lastPlaybackInfo = url.href

      const playback = data!

      if (playback.MediaSources![0].TranscodingUrl) {
        this._transcodingUrl = new URL(
          `${server.url}${playback.MediaSources![0].TranscodingUrl}`,
        )
      }

      return playback
    },

    setPlaybackInfo(info: PlaybackInfoResponse) {
      if (!info) {
        // TODO: How is it going null?
        throw Error('I was asked to nullify playback info!')
      }

      this.info = info
    },

    setPlaybackHeightAndWidth(width?: number, height?: number) {
      if (!this._transcodingUrl) return

      if (width) {
        this._transcodingUrl?.searchParams.set('maxWidth', width.toString())
      }

      if (height) {
        this._transcodingUrl?.searchParams.set('maxHeight', height.toString())
      }
    },

    setPlaybackAudioIndex(index: string | number) {
      if (!this._transcodingUrl || !index) return

      const _index = typeof index === 'number' ? index.toString() : index

      this._transcodingUrl.searchParams.set('AudioStreamIndex', _index)
    },

    setPlaybackVideoIndex(index: string | number) {
      if (!this._transcodingUrl || !index) return

      const _index = typeof index === 'number' ? index.toString() : index

      this._transcodingUrl.searchParams.set('VideoStreamIndex', _index)
    },

    setPlaybackSubtitleIndex(index: string | number) {
      if (!this._transcodingUrl || !index) return

      const _index = typeof index === 'number' ? index.toString() : index

      this._transcodingUrl.searchParams.set('SubtitleStreamIndex', _index)
    },

    setPlaybackVideoBitrate(bitrate: number) {
      if (!this._transcodingUrl) return

      this._transcodingUrl?.searchParams.set(
        'VideoBitrate',
        bitrate.toFixed(0),
      )
    },

    setPlaybackStart(start_ticks: number) {
      if (!this._transcodingUrl) return

      this._transcodingUrl?.searchParams.set(
        'startTimeTicks',
        start_ticks.toString(),
      )
    },

    setPlaybackSegmentLength(segment_length: number) {
      if (!this._transcodingUrl) return

      this._transcodingUrl?.searchParams.set(
        'actualSegmentLengthTicks',
        segment_length.toString(),
      )
    },

    setPlaybackRuntimeTicks(runtime_ticks: number) {
      if (!this._transcodingUrl) return

      this._transcodingUrl?.searchParams.set(
        'runtimeTicks',
        runtime_ticks.toString(),
      )
    },

    async stopPlaybackTranscode(session?: string) {
      if (!session && !this.info?.PlaySessionId) return

      const id = session || this.info?.PlaySessionId

      const auth = useAuthenticationStore()

      await useApiFetch(
        `Videos/ActiveEncodings?deviceId=${auth._header.deviceID}&playSessionId=${id}`,
        {
          headers: {
            Authorization: auth.header,
          },
          method: 'DELETE',
        },
      )

      this._transcodingUrl = null
    },

    async savePlaybackProgress(item: string, seconds: number) {
      if (!this.info?.PlaySessionId) return

      const playSession = this.info.PlaySessionId

      const auth = useAuthenticationStore()

      const secondsToTicks = (seconds * 10000000).toLocaleString('fullwide', {
        useGrouping: false,
      })

      await useApiFetch(
        `PlayingItems/${item}/Progress?deviceId=${auth._header.deviceID}&playSessionId=${playSession}&positionTicks=${secondsToTicks}`,
        {
          headers: {
            Authorization: auth.header,
          },
          method: 'POST',
        },
      )
    },

    async stopPlaybackProgress(item: string, seconds: number) {
      if (!this.info?.PlaySessionId) return

      const playSession = this.info.PlaySessionId

      const auth = useAuthenticationStore()

      const secondsToTicks = (seconds * 10000000).toLocaleString('fullwide', {
        useGrouping: false,
      })

      await useApiFetch(
        `PlayingItems/${item}?playSessionId=${playSession}&positionTicks=${secondsToTicks}`,
        {
          headers: {
            Authorization: auth.header,
          },
          method: 'DELETE',
        },
      )
    },
  },
})
