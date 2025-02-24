<script lang="ts">
	import { goto } from '$app/navigation';
	import { GameKind, MessageType, type CreateGame, type Game } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import { getYear } from '$lib/util.js';
	import LeftArrow from '../../../../components/icons/LeftArrow.svelte';

	let { data } = $props();

	async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);

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
		let res = await fetch(`${baseUrl}/games/${data.game.id}`, {
			method: 'PUT',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(game),
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let gameRes: Game = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Änderungen an Spiel ${gameRes.name} wurde erfolgreich gespeichert.`
		});
		goto(`/games/${data.game.id}`);
	}
</script>

<a href={`/games/${data.game.id}`} class="absolute top-0 left-14 py-6"><LeftArrow /></a>

<h1 class="absolute-center-x left-1/2 text-4xl font-bold pt-6">
	<span class="underline">{data.game.name}</span> bearbeiten
</h1>

<form class="flex flex-col w-80 m-auto gap-8" onsubmit={save}>
	<div class="w-full">
		<label class="label" for="trophy_id">
			<span class="label-text">Trophy-ID</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="trophy_id"
			type="number"
			required
			min="1"
			value={data.game.trophy_id}
		/>
	</div>

	<div>
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input
			class="input input-bordered w-full"
			name="name"
			type="text"
			required
			minlength="1"
			value={data.game.name}
		/>
	</div>

	<div>
		<label class="label" for="kind">
			<span class="label-text">Typ</span>
		</label>
		<select
			name="kind"
			class="select select-bordered w-full max-w-xs"
			required
			value={data.game.kind}
		>
			{#each Object.values(GameKind) as value}
				<option {value}> {value} </option>
			{/each}
		</select>
	</div>
	<button class="btn btn-primary w-full">Speichern</button>
</form>
