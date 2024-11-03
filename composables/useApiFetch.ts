import type { UseFetchOptions } from 'nuxt/app'

// TODO: Handle URL
export async function useApiFetch<T>(
  path: string,
  options: UseFetchOptions<T> = {},
  includesURL?: boolean | undefined,
) {
  const server = useServerStore()
  const url = includesURL ? path : `${server.url}/${path}`

  if (import.meta.server) {
    const { data, error } = await useFetch<T>(url, fetch as any); // eslint-disable-line

    if (error.value) {
      throw Error(error.value.message)
    }

    return data.value! as T
  }

  const data = await $fetch<T>(url, options as any); // eslint-disable-line
  return data! as T
}
