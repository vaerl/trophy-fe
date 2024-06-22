<script lang="ts">
	import { goto } from '$app/navigation';
	import { messageStore, yearStore } from '$lib/stores';
	import { GameKind, MessageType, type CreateGame, type Game } from '../../../lib/model';
	import { getYear } from '$lib/util';

	async function create(event: any) {
		const form = new FormData(event.target);
		let trophy_id = form.get('trophy_id');
		let name = form.get('name');
		let kind = form.get('kind');
		let year = getYear();

		let game: CreateGame = {
			trophy_id: parseInt(trophy_id!.toString()),
			name: name!.toString(),
			kind: kind as GameKind,
			year: parseInt(year.toString())
		};

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await fetch(`${baseUrl}/games`, {
			method: 'POST',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(game)
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		// go back to overview after successful creation
		let gameRes = (await res.json()) as Game;
		messageStore.set({
			type: MessageType.Success,
			message: `Spiel ${gameRes.name} wurde erfolgreich angelegt.`
		});
		goto(`/games`);
	}
</script>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">Neues Spiel anlegen</h1>

<form class="flex flex-col w-80 m-auto gap-8" on:submit|preventDefault={create}>
	<div>
		<label class="label" for="trophy_id">
			<span class="label-text">Trophy-ID</span>
		</label>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="input input-bordered w-full"
			name="trophy_id"
			type="number"
			required
			min="1"
			autofocus
		/>
	</div>

	<div>
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input class="input input-bordered w-full" name="name" type="text" required minlength="1" />
	</div>

	<div>
		<label class="label" for="kind">
			<span class="label-text">Typ</span>
		</label>
		<select name="kind" class="select select-bordered w-full max-w-xs" required>
			{#each Object.values(GameKind) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>
	<button class="btn btn-primary w-full">Speichern</button>
</form>
