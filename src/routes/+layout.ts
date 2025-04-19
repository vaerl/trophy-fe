import type { Game, Team, User } from '$lib/model';
import { getYear } from '$lib/util';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let year = getYear();
	let params = `?year=${year}`;

	const teams: Promise<Team[]> = fetch(`${baseUrl}/teams${params}`, {
		credentials: 'include'
	}).then((res) => res.json());

	const games: Promise<Game[]> = fetch(`${baseUrl}/games${params}`, {
		credentials: 'include'
	}).then((res) => res.json());

	const users: Promise<User[]> = fetch(`${baseUrl}/users`, { credentials: 'include' }).then((res) =>
		res.json()
	);

	return {
		teams,
		games,
		users
	};
};
