<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { GameKind, MessageType, type CreateGame, type Game } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import { getYear } from '$lib/util.js';
	import Loader from './blocks/Loader.svelte';
	import Navbar from './blocks/Navbar.svelte';
	import LeftArrow from './icons/LeftArrow.svelte';

	let { game }: { game?: Promise<Game> } = $props();
	let isLoading = $state(false);

	/**
	 * Updates or creates, depending on whether {@code game} is present.
	 * Also handles loading.
	 * @param event the SubmitEvent that triggered this call
	 * @param game the current game, may be undefined
	 */
	async function save(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
		game?: Game
	) {
		isLoading = true;
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		let trophy_id = form.get('trophy_id');
		let name = form.get('name');
		let kind = form.get('kind');
		let year = getYear();

		let updatedGame: CreateGame = {
			trophy_id: parseInt(trophy_id!.toString().trim()),
			name: name!.toString().trim(),
			kind: kind as GameKind,
			year: parseInt(year.toString())
		};

		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res;

		if (game) {
			res = await fetch(`${baseUrl}/games/${game.id}`, {
				method: 'PUT',
				headers: {
					// requests won't work without this
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updatedGame),
				credentials: 'include'
			});
		} else {
			res = await fetch(`${baseUrl}/games`, {
				method: 'POST',
				headers: {
					// requests won't work without this
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(updatedGame)
			});
		}

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		let gameRes: Game = await res.json();
		if (game) {
			messageStore.set({
				type: MessageType.Success,
				message: `Änderungen an Spiel ${gameRes.name} wurde erfolgreich gespeichert.`
			});
		} else {
			messageStore.set({
				type: MessageType.Success,
				message: `Spiel ${gameRes.name} wurde erfolgreich angelegt.`
			});
		}
		await goto(`/games/${gameRes.id}`);
		let params = `?year=${year}`;
		invalidate(`${baseUrl}/games${params}`);
		isLoading = false;
	}
</script>

<div class="flex flex-col h-full">
	{#await game}
		<div class="w-full h-full flex justify-center items-center">
			<Loader></Loader>
		</div>
	{:then game}
		<Navbar title={game ? `${game.name} bearbeiten` : 'Neues Spiel anlegen'}>
			{#snippet left()}
				{#if game}
					<a href={`/games/${game.id}`}><LeftArrow /></a>
				{/if}
			{/snippet}
		</Navbar>

		<div class="w-full h-full flex justify-center items-center">
			{#if isLoading}
				<Loader></Loader>
			{:else}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<form
					class="flex flex-col w-80 gap-8"
					onsubmit={(event) => save(event, game)}
					onkeydown={(event) => event.stopPropagation()}
				>
					<div class="w-full">
						<label class="label" for="trophy_id">
							<span class="label-text">Trophy-ID</span>
						</label>
						<!-- svelte-ignore a11y_autofocus -->
						<input
							class="input input-bordered w-full"
							name="trophy_id"
							type="number"
							required
							min="1"
							value={game?.trophy_id}
							autofocus
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
							value={game?.name}
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
							value={game?.kind}
						>
							{#each Object.values(GameKind) as value}
								<option {value}> {value} </option>
							{/each}
						</select>
					</div>
					<button class="btn btn-primary w-full" type="submit">Speichern</button>
				</form>
			{/if}
		</div>
	{/await}
</div>
