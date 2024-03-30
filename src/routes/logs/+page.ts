import type { History } from '$lib/model.js';

export async function load({ fetch }) {
	const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

	const logsRes = await fetch(`${baseUrl}/history`, { credentials: 'include' });
	const logs: History[] = await logsRes.json();

	return {
		logs
	};
}
