/**
 * This composable is used to fetch data from any url outside api platform.
 */

export default function useAuthFetch(url: string, options: any = {}) {
	const config = useRuntimeConfig();
	const baseUrl = config.public.apiUrl;

	const accessToken = useCookie<{ token: string }>("user");
	const tokenValue = accessToken.value?.token;

	if (tokenValue) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${tokenValue}`,
		};
	}

	return useFetch(`${baseUrl}${url}`, options);
}
