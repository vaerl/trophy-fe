import type { User } from '$lib/model';

export async function load({ fetch, params }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const userRes = await fetch(`${baseUrl}/users/${params.id}`, { credentials: 'include' });
	const user: User = await userRes.json();

	return {
		user
	};
}
