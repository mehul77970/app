import type {
  BaseItemDto,
  BaseItemDtoQueryResult,
} from '@jellyfin/sdk/lib/generated-client'
import { useApiFetch } from '@/composables/useApiFetch'

export type RefreshType = 'ValidationOnly' | 'Default' | 'FullRefresh'

export const useMediaBrowserStore = defineStore('mediaBrowser', {
  state: () => ({
    views: [] as BaseItemDto[],
    resumed: [] as BaseItemDto[],
  }),

  actions: {
    async getUserViews() {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(`UserViews`, {
        method: 'GET',
        headers: {
          Authorization: authentication.header,
        },
      })

      this.views = data.Items!
    },

    async getResumedContent() {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(
        `UserItems/Resume?limit=99`,
        {
          method: 'GET',
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      this.resumed = data!.Items!
    },

    async getResumedContentOfItem(item: string, limit: number = 5) {
      const authentication = useAuthenticationStore()
      const url = new URL(`UserItems/Resume`)

      url.searchParams.append('limit', limit.toString())
      url.searchParams.append('parentId', item)

      const data = await useApiFetch<BaseItemDtoQueryResult>(url.href, {
        method: 'GET',
        headers: {
          Authorization: authentication.header,
        },
      })

      return data.Items!
    },

    async getItemsOfView(view: string, limit: number = 20) {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(
        `Items?parentId=${view}&limit=${limit}&fields=DateCreated,Overview,SortName,Studios,Taglines,Genres,Tags,Path,ItemCounts,MediaSources,MediaSourceCount,ProviderIds`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      return data.Items! as BaseItemDto[]
    },

    async getEpisodesOfSeason(
      show?: string,
      season?: string,
      limit: number = 20,
    ) {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(
        `Shows/${show}/Episodes?seasonId=${season}&limit=${limit}`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      return data.Items! as BaseItemDto[]
    },
    async getItem(id: string) {
      const authentication = useAuthenticationStore()

      const authenticationC = useCookie('authentication')
      console.log(
        'Authentication data',
        authentication.header,
        'Should be',
        authenticationC.value,
      )

      const data = await useApiFetch<BaseItemDto>(`Items/${id}`, {
        headers: {
          Authorization: authentication.header,
        },
      })

      return data!
    },

    async updateItem(item: BaseItemDto) {
      const authentication = useAuthenticationStore()

      await useApiFetch<BaseItemDto>(`Items/${item.Id!}`, {
        headers: {
          Authorization: authentication.header,
        },

        method: 'POST',

        body: JSON.stringify(item),
      })
    },

    async refreshItem(
      id: string,
      type: RefreshType,
      { recursive = true, replace_all = false, replace_images = false },
    ) {
      const authentication = useAuthenticationStore()

      await useApiFetch<BaseItemDto>(
        `Items/${id}/Refresh?metadataRefreshMode=${type}&replaceAllMetadata=${replace_all}&replaceAllImages=${replace_images}&Recursive=${recursive}`,
        {
          headers: {
            Authorization: authentication.header,
          },
          method: 'POST',
        },
      )
    },
    async getNextUp(id: string, limit: number | undefined = 1) {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(
        `Shows/NextUp?parentId=${id}&limit=${limit}`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      return data.Items!
    },

    async getSeasons(id: string, limit: number = 20) {
      const authentication = useAuthenticationStore()

      const items = await useApiFetch<BaseItemDtoQueryResult>(
        `Shows/${id}/Seasons?limit=${limit}`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      return items!.Items as BaseItemDto[]
    },

    generateImageURL(
      id: string,
      type: string = 'Primary',
      width: number | undefined = undefined,
      height: number | undefined = undefined,
      quality: number | undefined = 85,
    ) {
      const server = useServerStore()
      const url = new URL(`${server.url}/Items/${id}/Images/${type}`)

      if (width) {
        url.searchParams.set('fillWidth', width.toString())
      }

      if (height) {
        url.searchParams.set('fillHeight', height.toString())
      }

      if (quality) {
        url.searchParams.set('quality', quality.toString())
      }

      return url.href
    },
  },
})
