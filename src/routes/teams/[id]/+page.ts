import type { Outcome, Team } from '$lib/model.js';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamRes = await fetch(`${baseUrl}/teams/${params.id}`, { credentials: 'include' });
	const team: Team = await teamRes.json();

	const outcomeRes = await fetch(`${baseUrl}/outcomes/teams/${params.id}`, {
		credentials: 'include'
	});
	const outcomes: Outcome[] = await outcomeRes.json();

	return { team, outcomes };
}
