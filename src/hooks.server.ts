// auto-include credentials for relevant requests
export async function handleFetch({ request, fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	if (request.url.startsWith(baseUrl)) {
		console.debug('Including credentials.');
		// clone the original request and include credentials
		return fetch(request, { credentials: 'include' });
	}

	return fetch(request);
}
