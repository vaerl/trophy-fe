<script lang="ts">
	import { goto } from '$app/navigation';
	import { GameKind, MessageType, type CreateGame, type Game } from '$lib/model.js';
	import { messageStore } from '$lib/stores';
	import { getYear } from '$lib/util.js';
	import Loader from './blocks/Loader.svelte';
	import LogoutButton from './blocks/LogoutButton.svelte';
	import Navbar from './blocks/Navbar.svelte';
	import Cog from './icons/Cog.svelte';
	import Home from './icons/Home.svelte';
	import Info from './icons/Info.svelte';
	import LeftArrow from './icons/LeftArrow.svelte';
	import UserIcon from './icons/UserIcon.svelte';

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
		isLoading = false;
	}
</script>

<div class="flex flex-col h-full">
	{#await game}
		<Navbar>
			{#snippet left()}
				<a href="/settings"><Cog /></a>
				<a href="/overview/pie"><Home /></a>
				<a href="/games"><LeftArrow /></a>
			{/snippet}
			{#snippet right()}
				<a href="/users"> <UserIcon /> </a>
				<a href="/logs"> <Info /> </a>
				<LogoutButton></LogoutButton>
			{/snippet}
		</Navbar>
		<div class="w-full h-full flex justify-center items-center">
			<Loader></Loader>
		</div>
	{:then game}
		<Navbar title={game ? `${game.name} bearbeiten` : 'Neues Spiel anlegen'}>
			{#snippet left()}
				<a href="/settings"><Cog /></a>
				<a href="/overview/pie"><Home /></a>
				{#if game}
					<a href={`/games/${game.id}`}><LeftArrow /></a>
				{:else}
					<a href="/games"><LeftArrow /></a>
				{/if}
			{/snippet}
			{#snippet right()}
				<a href="/users"> <UserIcon /> </a>
				<a href="/logs"> <Info /> </a>
				<LogoutButton></LogoutButton>
			{/snippet}
		</Navbar>

		<div class="w-full h-full flex justify-center items-center">
			{#if isLoading}
				<Loader></Loader>
			{:else}
				<form class="flex flex-col w-80 gap-8" onsubmit={(event) => save(event, game)}>
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
							value={game?.trophy_id}
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
					<button class="btn btn-primary w-full">Speichern</button>
				</form>
			{/if}
		</div>
	{/await}
</div>
