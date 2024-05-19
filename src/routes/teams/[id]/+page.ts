import type { Outcome, Team } from '$lib/model.js';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const teamRes = await fetch(`${baseUrl}/teams/${params.id}`, { credentials: 'include' });
	const team: Team | { error: string } = await teamRes.json();

	if ('error' in team) {
		// redirect back to /teams if we couldn't GET the team,
		// f.e. when using history after deletion
		redirect(302, '/teams');
	}

	const outcomeRes = await fetch(`${baseUrl}/outcomes/teams/${params.id}`, {
		credentials: 'include'
	});
	const outcomes: Outcome[] = await outcomeRes.json();

	return { team, outcomes };
}
