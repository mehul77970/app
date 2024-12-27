import type {
  UserItemDataDto,
  BaseItemDto,
  BaseItemDtoQueryResult,
} from '@jellyfin/sdk/lib/generated-client'
import { notify } from 'notiwind'
import { useApiFetch } from '@/composables/useApiFetch'

export type RefreshType = 'ValidationOnly' | 'Default' | 'FullRefresh'

export const useMediaBrowserStore = defineStore('mediaBrowser', {
  state: () => ({
    views: [] as BaseItemDto[],
    resumed: [] as BaseItemDto[],
  }),

  getters: {
    _log: () => useLoggerStore(),
  },

  actions: {
    async getUserViews() {
      const authentication = useAuthenticationStore()

      if (!authentication.loggedIn) {
        notify({ title: 'Invalid Authentication', type: 'danger' })
        await navigateTo('/login')
        return
      }

      const data = await useApiFetch<BaseItemDtoQueryResult>(`UserViews`, {
        method: 'GET',
        headers: {
          Authorization: authentication.header,
        },
      })

      this._log.$log({ message: 'Get /UserViews', location: 'MediaBrowser' })
      this.views = data.Items || []
    },

    async getResumedContent() {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(
        `UserItems/Resume?limit=15&fields=ParentId&enableImageTypes=Primary,Art,Logo,Screenshot,Banner,Backdrop`,
        {
          method: 'GET',
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      this._log.$log({ message: 'Get /UsersItems/Resume', location: 'MediaBrowser' })
      this.resumed = data.Items || []
    },

    async getResumedContentOfItem(item: string, limit: number = 5) {
      const authentication = useAuthenticationStore()
      const url = new URL(`UserItems/Resume`)

      url.searchParams.append('limit', limit.toString())
      url.searchParams.append('parentId', item)
      url.searchParams.append('fields', `ParentId`)
      const data = await useApiFetch<BaseItemDtoQueryResult>(url.href, {
        method: 'GET',
        headers: {
          Authorization: authentication.header,
        },
      })

      return data.Items!
    },

    // TODO: Add sort asc/desc
    async getItemsOfView(view: string, limit: number = 20, startIndex: number = 0) {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDtoQueryResult>(
        `Items?parentId=${view}&limit=${limit}&startIndex=${startIndex}&fields=DateCreated,Overview,SortName,Studios,Taglines,Genres,Tags,Path,ItemCounts,MediaSources,MediaSourceCount,ProviderIds,ParentId&enableImageTypes=Primary,Art,Logo,Screenshot,Banner,Backdrop`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

      this._log.$log({ message: 'Get /Items', location: 'MediaBrowser' })
      return data
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

      this._log.$log({ message: `Get /Shows/${show}/Episodes`, location: 'MediaBrowser' })
      return data.Items! as BaseItemDto[]
    },
    async getItem(id: string) {
      const authentication = useAuthenticationStore()

      const data = await useApiFetch<BaseItemDto>(
        `Items/${id}?fields=ParentId`,
        {
          headers: {
            Authorization: authentication.header,
          },
        },
      )

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
    async favoriteItem(_item: BaseItemDto | string) {
      // @ts-expect-error Loose type check
      const item = _item?.Id || _item
      const authentication = useAuthenticationStore()
      const user = useUserStore().user?.Id

      const patchedUserData = await useApiFetch<UserItemDataDto>(`Users/${user}/FavoriteItems/${item}`, {
        method: 'POST',
        headers: {
          Authorization: authentication.header,
        },
      })

      return patchedUserData
    },
    async unfavoriteItem(_item: BaseItemDto | string) {
      // @ts-expect-error Loose type check
      const item = _item?.Id || _item
      const authentication = useAuthenticationStore()
      const user = useUserStore().user?.Id

      const patchedUserData = await useApiFetch<UserItemDataDto>(`Users/${user}/FavoriteItems/${item}`, {
        method: 'DELETE',
        headers: {
          Authorization: authentication.header,
        },
      })

      return patchedUserData
    },
    generateDownloadURL(item: BaseItemDto | string) {
      const authentication = useAuthenticationStore()
      const server = useServerStore()

      // @ts-expect-error Loose type check
      return `${server.url}/Items/${item?.Id || item}/Download?api_key=${authentication._header.authorization}`
    },

    generateStreamURL(item: BaseItemDto | string) {
      const authentication = useAuthenticationStore()
      const server = useServerStore()

      // @ts-expect-error Loose type check
      return `${server.url}/Videos/${item?.Id || item}/stream.mp4?Static=true&deviceId=${authentication._header.deviceID}&api_key=${authentication._header.authorization}`
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
  persist: false,
})
