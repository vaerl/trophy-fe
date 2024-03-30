import { GameKind, type CreateGame, type Game } from '$lib/model';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async (event) => {
		let data = await event.request.formData();

		let trophy_id = data.get('trophy_id');
		if (!trophy_id) {
			return fail(400, { field: 'Trophy-ID', missing: true });
		}

		let name = data.get('name');
		if (!name) {
			return fail(400, { field: 'Name', missing: true });
		}

		let kind = data.get('kind');
		if (!kind) {
			return fail(400, { field: 'Typ', missing: true });
		}

		let game: CreateGame = {
			trophy_id: parseInt(trophy_id.toString()),
			name: name.toString(),
			kind: kind as GameKind
		};

		let cookie = event.cookies.get('session');
		if (!cookie) {
			return fail(400, { unauthorized: true });
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await event.fetch(`${baseUrl}/games`, {
			method: 'POST',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(game)
		});

		if (res.status != 200) {
			return fail!(422, { miscellaneous: true, detail: await res.text() });
		}

		// go back to overview after successful creation
		return { success: true, game: (await res.json()) as Game };
	}
};
