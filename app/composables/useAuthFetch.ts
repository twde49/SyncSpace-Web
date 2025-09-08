/**
 * Composable for authenticated fetch requests using user's JWT token.
 * Adds Authorization header if token is available.
 *
 * @param url - The endpoint URL (relative to API base).
 * @param options - Fetch options (method, headers, body, etc.).
 * @returns useFetch result for the request.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useAuthFetch(url: string, options: any = {}) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  const accessToken = useCookie<{ token: string }>('user')
  const tokenValue = accessToken.value?.token

  if (tokenValue) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${tokenValue}`,
    }
  }

  return useFetch(`${baseUrl}${url}`, options)
}
