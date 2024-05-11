import type { Game, User } from '$lib/model';

export async function load({ fetch, params, url }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const userRes = await fetch(`${baseUrl}/users/${params.id}`, { credentials: 'include' });
	const user: User = await userRes.json();

	const gamesRes = await fetch(`${baseUrl}/games${url.search}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	return {
		user,
		games
	};
}
