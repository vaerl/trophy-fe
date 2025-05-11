import type { History } from '$lib/model.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const logs: Promise<History[]> = fetch(`${baseUrl}/history`, { credentials: 'include' }).then(
		(res) => res.json()
	);

	return {
		logs
	};
};
