import type { Game, GameWithPending, Team } from '$lib/model';
import { getYear } from '$lib/util';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teamsAmount: Promise<number> = fetch(`${baseUrl}/teams/amount${params}`, {
		credentials: 'include'
	}).then((res) => res.json());
	const games: Promise<Game[]> = fetch(`${baseUrl}/games${params}`, {
		credentials: 'include'
	}).then((res) => res.json());

	const gamesWithPending: Promise<GameWithPending[]> = games.then((games) =>
		Promise.all(
			games.map((g) =>
				fetch(import.meta.env.VITE_BACKEND_URL + `/games/${g.id}/pending`, {
					method: 'GET',
					credentials: 'include'
				})
					.then((res) => res.json())
					.then((teams: Team[]) => ({ ...g, pendingTeams: teams.length }))
			)
		)
	);

	return {
		teamsAmount,
		gamesWithPending
	};
}
