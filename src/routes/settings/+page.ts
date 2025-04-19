import type { PageLoad } from './$types.js';

export const load: PageLoad = ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const years: Promise<number[]> = fetch(`${baseUrl}/years`, { credentials: 'include' })
		.then((res) => res.json())
		.then((y) => y.map((n: number) => n.toString()));

	return {
		years
	};
};
