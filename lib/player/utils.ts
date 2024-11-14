import type {
  BaseItemDto,
  MediaStream,
  PlaybackInfoResponse,
} from "@jellyfin/sdk/lib/generated-client";

export interface VideoSource {
  source: MediaStream;
  hdr: boolean;
  dolbyDigital: boolean;
  is4k: boolean;
  title: string;
}

export interface AudioSource {
  source: MediaStream;
  dolbyAudio: boolean;
  dtsAudio: boolean;
  channelTitle?: string;
  title: string;
}

export interface SubtitleSource {
  source?: MediaStream;
  title: string;
}

export function createVideoSource(source?: MediaStream): VideoSource | null {
  if (!source) return null;

  let title = "";
  let hdr = false;
  let is4k = false;
  let dolbyDigital = false;

  title += `${source.Width}x${source.Height}`;

  if (source.VideoRange === "HDR") {
    hdr = true;
  }

  if (source.DisplayTitle?.includes("Dolby Vision")) {
    dolbyDigital = true;
  }

  if (source.Width! >= 3840) {
    is4k = true;
  }

  return {
    source,
    hdr,
    dolbyDigital,
    is4k,
    title,
  };
}

export function createAudioSource(source?: MediaStream): AudioSource | null {
  if (!source || !source.Language) return null;

  let title = "";
  let channelTitle = undefined as undefined | string;
  let dolbyAudio = false;
  let dtsAudio = false;

  const languages = new Intl.DisplayNames(["en"], { type: "language" });

  title += `${languages.of(source.Language!)}`;

  title += " (";
  switch (source.ChannelLayout) {
    case "mono":
      title += "Mono";
      break;
    case "stereo":
      title += "Stereo";
      break;
    default:
      title += `${source.ChannelLayout}`;
      channelTitle = `${source.ChannelLayout}`;
      break;
  }

  if (source.DisplayTitle?.includes("Dolby Digital")) {
    dolbyAudio = true;
    // channelTitle += ' Dolby Digital';
    // title += ' Dolby Digital';
  }

  if (source.DisplayTitle?.includes("DTS-HD")) {
    dtsAudio = true;
    // channelTitle += ' DTS-HD';
    // title += ' DTS-HD';
  }

  title += ")";

  return {
    source,
    dolbyAudio,
    dtsAudio,
    channelTitle,
    title,
  };
}

export function createSubtitleSource(
  source?: MediaStream,
): SubtitleSource | null {
  if (!source) return null;

  let title = "";

  const languages = new Intl.DisplayNames(["en"], { type: "language" });

  if (source.Language) {
    title += `${languages.of(source.Language!)}`;
  } else {
    title += "Unknown Language";
  }

  if (source.Title) {
    title += ` (${source.Title})`;
  }

  return {
    source,
    title,
  };
}

export function getDefaultMediaStreams(
  playback: PlaybackInfoResponse | BaseItemDto,
) {
  if (!playback.MediaSources || !playback.MediaSources[0]) {
    console.warn("No default sources found");
    return { video: null, audio: null, subtitle: null };
  }
  const mediaSource = playback.MediaSources[0];
  const mediaStreams = mediaSource.MediaStreams!;

  const defaultVideo = mediaStreams.find((src) => src.Type === "Video");
  const defaultAudio = mediaStreams.find(
    (src) => src.Type === "Audio" && src.IsDefault,
  );
  const defaultSubtitle = mediaStreams.find(
    (src) => src.Type === "Subtitle" && src.IsDefault,
  );

  return {
    video: createVideoSource(defaultVideo),
    audio: createAudioSource(defaultAudio),
    subtitle: createSubtitleSource(defaultSubtitle),
  };
}

export function getSubtitleStreams(
  playback: PlaybackInfoResponse | BaseItemDto,
  createEmpty: boolean = true,
) {
  if (!playback.MediaSources || !playback.MediaSources[0]) {
    console.warn("No subtitle sources found");
    return [];
  }
  const mediaSource = playback.MediaSources[0];
  const subtitleStreams = mediaSource.MediaStreams!.filter(
    (src) => src.Type === "Subtitle",
  );

  const subtitleSources = [] as SubtitleSource[];

  // Create empty subtitle track
  if (createEmpty) {
    subtitleSources.push({
      title: "None",
      source: {
        Index: -1,
      },
    });
  }

  for (let i = 0; subtitleStreams.length > i; i++) {
    const currentSubtitleStream = subtitleStreams[i];

    subtitleSources.push(createSubtitleSource(currentSubtitleStream)!);
  }

  return subtitleSources;
}

export function getAudioStreams(playback: PlaybackInfoResponse | BaseItemDto) {
  if (!playback.MediaSources || !playback.MediaSources[0]) {
    console.warn("No audio sources found");
    return [];
  }
  const mediaSource = playback.MediaSources[0];
  const audioStreams = mediaSource.MediaStreams!.filter(
    (src) => src.Type === "Audio",
  );

  const audioSources = [] as AudioSource[];

  for (let i = 0; audioStreams.length > i; i++) {
    const currentAudioStream = audioStreams[i];

    audioSources.push(createAudioSource(currentAudioStream)!);
  }

  return audioSources;
}

export function getVideoStreams(playback: PlaybackInfoResponse | BaseItemDto) {
  if (!playback.MediaSources || !playback.MediaSources[0]) {
    console.warn("No video sources found");
    return [];
  }

  const mediaSource = playback.MediaSources[0];
  const videoStreams = mediaSource.MediaStreams!.filter(
    (src) => src.Type === "Video",
  );

  const videoSources = [] as VideoSource[];

  for (let i = 0; videoStreams.length > i; i++) {
    const currentVideoStream = videoStreams[i];

    videoSources.push(createVideoSource(currentVideoStream)!);
  }

  return videoSources;
}

export function getMediaSources(
  playback: PlaybackInfoResponse | BaseItemDto,
  createEmpty: boolean = true,
) {
  if (!playback.MediaSources || !playback.MediaSources[0]) {
    console.warn("No media sources found");
    return { videoSources: [], audioSources: [], subtitleSources: [] };
  }

  const videoSources = getVideoStreams(playback);
  const audioSources = getAudioStreams(playback);
  const subtitleSources = getSubtitleStreams(playback, createEmpty);

  return { videoSources, audioSources, subtitleSources };
}

export type PlayerType = "hls" | "http" | "native";

export function getPlayerType(info?: PlaybackInfoResponse): PlayerType | null {
  if (!info) return null;
  const native = useDeviceStore().nativeEnviroment;
  const nativePlayerEnabled = usePlayerStore().settings.native;

  if (native && nativePlayerEnabled) {
    return "native";
  }

  if (info.MediaSources) {
    const defaultMediaSource = info.MediaSources[0];
    if (defaultMediaSource.TranscodingUrl) return "hls";
  }

  return "http";
}

export function getSubtitleStream(subtitle: SubtitleSource, id: string) {
  if (!subtitle.source) return;
  if (subtitle.source.DeliveryUrl) return subtitle.source.DeliveryUrl;

  return `/Videos/${id}/${id}/Subtitles/${subtitle.source.Index}/0/Stream.${getSubtitleCodec(subtitle.source.Codec!)}`;
}

function getSubtitleCodec(codec: string) {
  if (codec !== "subrip") return codec;

  if (codec === "subrip") return "vtt";
}
