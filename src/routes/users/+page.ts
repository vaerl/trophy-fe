import type { User } from '$lib/model';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const usersRes = await fetch(`${baseUrl}/users`, { credentials: 'include' });
	const users: User[] = await usersRes.json();

	return {
		users
	};
}
