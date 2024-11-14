import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client'

export type ImageType = 'Logo' | 'Thumb' | 'Primary'

export interface ImageOptions {
  type?: ImageType
  fallback?: ImageType
}

export function useServerImage(
  item: BaseItemDto,
  { type = 'Primary', fallback = 'Primary' }: ImageOptions = {},
) {
  const serverAPI = useServerStore()._url
  const path
    = 'Items/'
    + (item?.ImageTags?.[type]
      || item?.ImageTags?.[fallback]
      || item?.Type === 'Movie'
      ? `${item?.Id}`
      : `${item?.SeriesId}`)
    + `/Images/${item?.ImageTags?.[type] ? type : fallback}`

  const image
    = item?.ImageTags?.[type]
    || item?.[`Parent${type}ImageTag`]
    || item?.ImageTags?.[fallback]
    || item?.SeriesPrimaryImageTag

  return image || item?.Type === 'Movie'
    ? `${serverAPI}/${path}?fillHeight=1024&quality=96${image ? `&tag=${image}` : ''}`
    : '/placeholder.svg'
}
