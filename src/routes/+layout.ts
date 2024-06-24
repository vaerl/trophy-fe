import { checkAuth } from '$lib/auth';
import type { Game, Team, User } from '$lib/model';
import { getYear } from '$lib/util';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export async function load({ fetch, url }) {
	if (url.pathname === '/login') {
		return { teams: [], games: [], users: [] };
	}

	let isAuthenticated = await checkAuth(fetch);
	if (!isAuthenticated) {
		throw redirect(307, '/login');
	}

	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teamsRes = await fetch(`${baseUrl}/teams${params}`, { credentials: 'include' });
	const teams: Team[] = await teamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games${params}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	const usersRes = await fetch(`${baseUrl}/users`, { credentials: 'include' });
	const users: User[] = await usersRes.json();

	return {
		teams,
		games,
		users
	};
}
