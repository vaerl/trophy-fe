import type { Game, StatusResponse, Team, User } from '$lib/model';
import { getYear } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
	let isAuthenticated: StatusResponse = await fetch(`${baseUrl}/user/status`, {
		credentials: 'include'
	}).then((res) => res.json());

	// redirect to pie-chart if we're already logged in
	if (isAuthenticated.status) {
		redirect(307, '/overview/pie');
	}
};
