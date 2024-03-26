import type { Team } from '$lib/model';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamsRes = await fetch(`${baseUrl}/teams`, { credentials: 'include' });
	const teams: Team[] = await teamsRes.json();

	return {
		teams
	};
}
