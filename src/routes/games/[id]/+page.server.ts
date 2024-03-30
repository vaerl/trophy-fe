import { type Outcome } from '$lib/model';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	save: async (event) => {
		let formData = await event.request.formData();

		let data = formData.get('data');
		if (!data) {
			return fail(400, { field: 'Data', missing: true });
		}

		let outcome = formData.get('outcome');
		if (!outcome) {
			return fail(400, { field: 'Outcome', missing: true });
		}

		let cookie = event.cookies.get('session');
		if (!cookie) {
			return fail(400, { unauthorized: true });
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let updatedOutcome: Outcome = {
			...JSON.parse(outcome.toString()),
			data
		};
		let res = await event.fetch(`${baseUrl}/outcomes`, {
			method: 'PUT',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedOutcome)
		});

		if (res.status != 200) {
			return fail!(422, { miscellaneous: true, detail: await res.text() });
		}

		// go back to overview after successful creation
		return { success: true, outcome: (await res.json()) as Outcome };
	},
	delete: async (event) => {
		let id = event.params.id;

		let cookie = event.cookies.get('session');
		if (!cookie) {
			return fail(400, { unauthorized: true });
		}

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await event.fetch(`${baseUrl}/games/${id}`, {
			method: 'DELETE',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			}
		});

		if (res.status != 200) {
			return fail!(422, { miscellaneous: true, detail: await res.text() });
		}

		// go back to /teams after deletion
		redirect(302, '/games');
	}
};
