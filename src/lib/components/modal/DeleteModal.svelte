<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { MessageType, type Game, type Team, type User } from '$lib/model';
	import { messageStore } from '$lib/stores';
	import { getYear, linkPrefix, typeName } from '$lib/util';
	import Loader from '../blocks/Loader.svelte';

	let { item }: { item: Promise<Game | Team | User> } = $props();

	let nameInput: string = $state('');

	async function deleteItem(event: Event, item: Game | Team | User) {
		event.preventDefault();
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;

		let res = await fetch(`${baseUrl}/${linkPrefix(item)}/${item.id}`, {
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
		let json: User | Game | Team = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `${typeName(item)} ${json.name} wurde erfolgreich gelöscht.`
		});
		await goto(`/${linkPrefix(item)}`);
		let invalidateUrl = `${baseUrl}/${linkPrefix(item)}`;

		// only add the year-param if we're not deleting a user
		if (linkPrefix(item) != 'users') {
			let year = getYear();
			let params = `?year=${year}`;
			invalidateUrl += params;
		}

		invalidate(invalidateUrl);
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
				<h1 class="font-bold text-xl text-center pb-2">
					{typeName(item)} "{item.name}" wirklich löschen?
				</h1>
				<p class="text-center pb-6">Bitte gib den Namen ein, um das Löschen zu bestätigen.</p>
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
