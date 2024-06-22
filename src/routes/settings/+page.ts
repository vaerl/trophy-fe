import type { Game, Team } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teamsRes = await fetch(`${baseUrl}/teams${params}`, { credentials: 'include' });
	const teams: Team[] = await teamsRes.json();

	const gamesRes = await fetch(`${baseUrl}/games${params}`, { credentials: 'include' });
	const games: Game[] = await gamesRes.json();

	const yearsRes = await fetch(`${baseUrl}/years`, { credentials: 'include' });
	const years: number[] = await yearsRes.json();

	return {
		years: years.map((y) => y.toString()),
		teams,
		games
	};
}
