import type { DeviceProfile } from '@jellyfin/sdk/lib/generated-client'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    profile: null as null | DeviceProfile,
    bitrate: 100000000,
    acknowledgedEarlyAccess: false,
    nativeEnvironment: false,
  }),

  actions: {
    testSetDeviceProfile() {
      this.profile = {
        MaxStreamingBitrate: 120000000,
        MaxStaticBitrate: 100000000,
        MusicStreamingTranscodingBitrate: 384000,
        DirectPlayProfiles: [
          {
            Container: 'webm',
            Type: 'Video',
            VideoCodec: 'vp8,vp9,av1',
            AudioCodec: 'vorbis,opus',
          },
          {
            Container: 'mp4,m4v',
            Type: 'Video',
            VideoCodec: 'h264,hevc,vp9,av1',
            AudioCodec: 'aac,mp3,mp2,opus,flac,vorbis',
          },
          { Container: 'opus', Type: 'Audio' },
          { Container: 'webm', AudioCodec: 'opus', Type: 'Audio' },
          { Container: 'mp3', Type: 'Audio' },
          { Container: 'aac', Type: 'Audio' },
          { Container: 'm4a', AudioCodec: 'aac', Type: 'Audio' },
          { Container: 'm4b', AudioCodec: 'aac', Type: 'Audio' },
          { Container: 'flac', Type: 'Audio' },
          { Container: 'webma', Type: 'Audio' },
          { Container: 'webm', AudioCodec: 'webma', Type: 'Audio' },
          { Container: 'wav', Type: 'Audio' },
          { Container: 'ogg', Type: 'Audio' },
          {
            Container: 'hls',
            Type: 'Video',
            VideoCodec: 'av1,h264',
            AudioCodec: 'aac,mp2,opus,flac',
          },
          {
            Container: 'hls',
            Type: 'Video',
            VideoCodec: 'h264',
            AudioCodec: 'aac,mp3,mp2',
          },
        ],
        TranscodingProfiles: [
          {
            Container: 'mp4',
            Type: 'Audio',
            AudioCodec: 'aac',
            Context: 'Streaming',
            Protocol: 'hls',
            MaxAudioChannels: '2',
            MinSegments: 1,
            BreakOnNonKeyFrames: true,
          },
          {
            Container: 'aac',
            Type: 'Audio',
            AudioCodec: 'aac',
            Context: 'Streaming',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'mp3',
            Type: 'Audio',
            AudioCodec: 'mp3',
            Context: 'Streaming',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'opus',
            Type: 'Audio',
            AudioCodec: 'opus',
            Context: 'Streaming',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'wav',
            Type: 'Audio',
            AudioCodec: 'wav',
            Context: 'Streaming',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'opus',
            Type: 'Audio',
            AudioCodec: 'opus',
            Context: 'Static',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'mp3',
            Type: 'Audio',
            AudioCodec: 'mp3',
            Context: 'Static',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'aac',
            Type: 'Audio',
            AudioCodec: 'aac',
            Context: 'Static',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'wav',
            Type: 'Audio',
            AudioCodec: 'wav',
            Context: 'Static',
            Protocol: 'http',
            MaxAudioChannels: '2',
          },
          {
            Container: 'mp4',
            Type: 'Video',
            AudioCodec: 'aac,mp2,opus,flac',
            VideoCodec: 'av1,h264',
            Context: 'Streaming',
            Protocol: 'hls',
            MaxAudioChannels: '2',
            MinSegments: 1,
            BreakOnNonKeyFrames: true,
          },
          {
            Container: 'ts',
            Type: 'Video',
            AudioCodec: 'aac,mp3,mp2',
            VideoCodec: 'h264',
            Context: 'Streaming',
            Protocol: 'hls',
            MaxAudioChannels: '2',
            MinSegments: 1,
            BreakOnNonKeyFrames: true,
          },
        ],
        ContainerProfiles: [],
        CodecProfiles: [
          {
            Type: 'VideoAudio',
            Codec: 'aac',
            Conditions: [
              {
                Condition: 'Equals',
                Property: 'IsSecondaryAudio',
                Value: 'false',
                IsRequired: false,
              },
            ],
          },
          {
            Type: 'VideoAudio',
            Conditions: [
              {
                Condition: 'Equals',
                Property: 'IsSecondaryAudio',
                Value: 'false',
                IsRequired: false,
              },
            ],
          },
          {
            Type: 'Video',
            Codec: 'h264',
            Conditions: [
              {
                Condition: 'NotEquals',
                Property: 'IsAnamorphic',
                Value: 'true',
                IsRequired: false,
              },
              {
                Condition: 'EqualsAny',
                Property: 'VideoProfile',
                Value: 'high|main|baseline|constrained baseline',
                IsRequired: false,
              },
              {
                Condition: 'EqualsAny',
                Property: 'VideoRangeType',
                Value: 'SDR',
                IsRequired: false,
              },
              {
                Condition: 'LessThanEqual',
                Property: 'VideoLevel',
                Value: '52',
                IsRequired: false,
              },
              {
                Condition: 'NotEquals',
                Property: 'IsInterlaced',
                Value: 'true',
                IsRequired: false,
              },
            ],
          },
          {
            Type: 'Video',
            Codec: 'hevc',
            Conditions: [
              {
                Condition: 'NotEquals',
                Property: 'IsAnamorphic',
                Value: 'true',
                IsRequired: false,
              },
              {
                Condition: 'EqualsAny',
                Property: 'VideoProfile',
                Value: 'main|main 10',
                IsRequired: false,
              },
              {
                Condition: 'EqualsAny',
                Property: 'VideoRangeType',
                Value: 'SDR',
                IsRequired: false,
              },
              {
                Condition: 'LessThanEqual',
                Property: 'VideoLevel',
                Value: '183',
                IsRequired: false,
              },
              {
                Condition: 'NotEquals',
                Property: 'IsInterlaced',
                Value: 'true',
                IsRequired: false,
              },
            ],
          },
          {
            Type: 'Video',
            Codec: 'vp9',
            Conditions: [
              {
                Condition: 'EqualsAny',
                Property: 'VideoRangeType',
                Value: 'SDR',
                IsRequired: false,
              },
            ],
          },
          {
            Type: 'Video',
            Codec: 'av1',
            Conditions: [
              {
                Condition: 'NotEquals',
                Property: 'IsAnamorphic',
                Value: 'true',
                IsRequired: false,
              },
              {
                Condition: 'EqualsAny',
                Property: 'VideoProfile',
                Value: 'main',
                IsRequired: false,
              },
              {
                Condition: 'EqualsAny',
                Property: 'VideoRangeType',
                Value: 'SDR',
                IsRequired: false,
              },
              {
                Condition: 'LessThanEqual',
                Property: 'VideoLevel',
                Value: '19',
                IsRequired: false,
              },
            ],
          },
        ],
        SubtitleProfiles: [
          { Format: 'vtt', Method: 'External' },
          { Format: 'ass', Method: 'External' },
          { Format: 'ssa', Method: 'External' },
        ],
      }
    },

    async bitrateTest() {
      const server = useServerStore()
      const auth = useAuthenticationStore()

      const bitrate = [500000, 1000000, 3000000]

      const getBitrate = async (bitrate: number) => {
        const last = performance.now()
        let totalProgressReports = 0
        let totalBitrateCalculations = 0

        await axios.get(`${server.url}/Playback/BitrateTest?Size=${bitrate}`, {
          responseType: 'blob',
          timeout: 5000,
          headers: {
            Authorization: auth.header,
          },
          onDownloadProgress: (progress: { bytes: number }) => {
            const t = 0.001 * (performance.now() - last)
            const i = progress.bytes
            const s = i / t
            const u = Math.round(8 * s)

            totalProgressReports += 1
            totalBitrateCalculations += u
          },
        })

        return totalBitrateCalculations / totalProgressReports
      }

      let maxBitrate = 0
      for (const bitrateTest of bitrate) {
        maxBitrate += await getBitrate(bitrateTest)
      }

      this.bitrate = maxBitrate / bitrate.length
    },
  },

  persist: {
    pick: ['profile', 'bitrate'],
  },
})
