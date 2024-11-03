import type {
  MediaStream,
  BaseItemDto,
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
  console.log("Got video source", source);
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
  if (!playback.MediaSources || !playback.MediaSources[0])
    throw new PlaybackInfoError("No MediaSource found", playback);
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
) {
  if (!playback.MediaSources || !playback.MediaSources[0])
    throw new PlaybackInfoError("No MediaSource found", playback);
  const mediaSource = playback.MediaSources[0];
  const subtitleStreams = mediaSource.MediaStreams!.filter(
    (src) => src.Type === "Subtitle",
  );

  const subtitleSources = [] as SubtitleSource[];

  // Create empty subtitle track
  subtitleSources.push({
    title: "None",
  });

  for (let i = 0; subtitleStreams.length > i; i++) {
    const currentSubtitleStream = subtitleStreams[i];

    subtitleSources.push(createSubtitleSource(currentSubtitleStream)!);
  }

  return subtitleSources;
}

export function getAudioStreams(playback: PlaybackInfoResponse | BaseItemDto) {
  if (!playback.MediaSources || !playback.MediaSources[0])
    throw new PlaybackInfoError("No MediaSource found", playback);
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

export type PlayerType = "hls" | "http";

export function getPlayerType(info?: PlaybackInfoResponse): PlayerType | null {
  if (!info) return null;

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
