import type { Game } from '$lib/model.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch, params }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let game: Promise<Game> = fetch(`${baseUrl}/games/${params.id}`, { credentials: 'include' }).then(
		(res) => res.json()
	);
	return {
		game
	};
};
