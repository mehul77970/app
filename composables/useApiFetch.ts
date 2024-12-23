import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'
// TODO: Handle URL
export async function useApiFetch<T>(
  path: string,
  options: UseFetchOptions<T> = {},
  includesURL?: boolean | undefined,
) {
  const server = useServerStore()
  const url = includesURL ? path : `${server.url}/${path}`

  if (import.meta.server) {
    // eslint-disable-next-line
    const { data, error } = await useFetch<T>(url, options as any);

    if (error.value) {
      throw createError({ fatal: false, statusCode: error.value?.statusCode ?? 500, statusMessage: `A request couldn't complete`, data: error.value.message, stack: error.value.stack })
    }

    return data.value! as T
  }
  try {
    // eslint-disable-next-line
    const data = await $fetch<T>(url, options as any);
    return data! as T
  }
  catch (e: unknown) {
    throw new ApiFetchError(e, (e as FetchError).response?.json)
  }
}

export class ApiFetchError extends Error {
  json: (() => Promise<unknown> | undefined) | undefined

  constructor(
    error: unknown,
    json: (() => Promise<unknown> | undefined) | undefined,
  ) {
    console.error(error)
    super((error as Error).message)
    this.json = json
  }
}
