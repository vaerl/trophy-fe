import type { GameWithPending, Team } from '$lib/model';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { games } = await parent();

	const gamesWithPending: Promise<GameWithPending[]> = games.then((games) =>
		Promise.all(
			games.map((g) =>
				fetch(import.meta.env.VITE_BACKEND_URL + `/games/${g.id}/pending/amount`, {
					method: 'GET',
					credentials: 'include'
				})
					.then((res) => res.json())
					.then((teams: number) => ({ ...g, pendingTeams: teams }))
			)
		)
	);

	return {
		gamesWithPending
	};
};
