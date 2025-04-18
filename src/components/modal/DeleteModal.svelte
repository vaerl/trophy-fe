<script lang="ts">
	import { goto } from '$app/navigation';
	import { isTeam, MessageType, type Game, type Team } from '$lib/model';
	import { messageStore } from '$lib/stores';
	import Loader from '../blocks/Loader.svelte';

	let { item }: { item: Promise<Game | Team> } = $props();

	let nameInput: string = $state('');

	async function deleteItem(event: Event, item: Game | Team) {
		event.preventDefault();
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let itemIsTeam = isTeam(item);
		let linkPrefix = itemIsTeam ? 'teams' : 'games';

		let res = await fetch(`${baseUrl}/${linkPrefix}/${item.id}`, {
			method: 'DELETE',
			headers: {
				// requests won't work without this
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (res.status != 200) {
			messageStore.set({
				type: MessageType.Error,
				message: `Etwas ist schiefgelaufen: ${await res.text()}`
			});
			return;
		}

		// go back to overview after successful creation
		let gameRes: Game = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Spiel ${gameRes.name} wurde erfolgreich gelöscht.`
		});
		await goto(`/${linkPrefix}`);
	}
</script>

<dialog class="modal" id="confirm-deletion-modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		{#await item}
			<div class="flex justify-center"><Loader></Loader></div>
		{:then item}
			<form>
				<h1 class="font-bold text-xl text-center pb-2">Spiel "{item.name}" wirklich löschen?</h1>
				<p class="text-center pb-6">Bitte gib den Namen des Spiels ein, um es zu löschen.</p>
				<input
					class="input input-bordered w-full"
					name="input"
					type="text"
					required
					bind:value={nameInput}
				/>

				<div class="modal-action flex flex-row justify-end">
					<button
						class="btn btn-primary w-full"
						class:btn-disabled={item.name !== nameInput}
						onclick={(e) => deleteItem(e, item)}>Löschen</button
					>
				</div>
			</form>
		{/await}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
