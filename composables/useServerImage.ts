import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'

export type ImageType = 'Logo' | 'Thumb' | 'Primary'

export interface ImageOptions {
  type?: ImageType
  fallback?: ImageType
  size?: number
  quality?: number
}

export function useServerImage(
  item: BaseItemDto,
  { type = 'Primary', fallback = 'Primary', size = 1920, quality = 85 }: ImageOptions = {},
) {
  const serverAPI = useServerStore()._url
  const defaultImageTag = item?.ImageTags?.[type]
  const fallbackImageTag = item?.ImageTags?.[fallback]
  const isMovie = item?.Type === 'Movie'
  const path
    = 'Items/'
    + (defaultImageTag
      || fallbackImageTag
      || isMovie
      ? `${item?.Id}`
      : `${item?.SeriesId}`)
    + `/Images/${defaultImageTag ? type : fallback}`

  const image
    = defaultImageTag
    || item?.[`Parent${type}ImageTag`]
    || fallbackImageTag
    || item?.SeriesPrimaryImageTag

  return image || isMovie
    ? `${serverAPI}/${path}?fillWidth=${size}&quality=${quality}${image ? `&tag=${image}` : ''}`
    : '/placeholder.svg'
}
