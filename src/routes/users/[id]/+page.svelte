<script lang="ts">
	import Edit from '../../../components/icons/Edit.svelte';
	import Delete from '../../../components/icons/Delete.svelte';
	import { messageStore, yearStore } from '$lib/stores';
	import { MessageType, type User } from '$lib/model';
	import { goto } from '$app/navigation';
	import LeftArrow from '../../../components/icons/LeftArrow.svelte';

	let { data } = $props();
	let showDeletion = $state(false);
	let nameInput: string = $state('');
	let modalContent: HTMLFormElement | undefined = $state();

	async function handleDelete(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		event.preventDefault();
		const baseUrl: string = import.meta.env.VITE_BACKEND_URL;
		let res = await fetch(`${baseUrl}/users/${data.user.id}`, {
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

		// go back to /users after deletion
		let userRes: User = await res.json();
		messageStore.set({
			type: MessageType.Success,
			message: `Nutzer ${userRes.name} wurde erfolgreich gelöscht.`
		});
		goto(`/users`);
	}

	/**
	 * Close the modal if we click out of it.
	 * @param event
	 */
	function onClickOutside(event: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement }) {
		event.preventDefault();
		if (modalContent && !modalContent.contains(event.currentTarget)) {
			closeDeletion(event);
		}
	}

	/**
	 * Hide the modal and reset the value of the input.
	 */
	function closeDeletion(event: Event) {
		event.preventDefault();
		showDeletion = false;
		nameInput = '';
	}
</script>

<a href="/users" class="absolute top-0 left-14 py-6"><LeftArrow /></a>

<!-- this is kinda hacky, but works -->
<div class="absolute right-0 top-0 py-6 mr-28 flex flex-row">
	<a href={`/users/${data.user.id}/edit?year=${$yearStore}`} class="ml-6"><Edit /></a>
	<button class="ml-6" onclick={() => (showDeletion = true)}><Delete /></button>
</div>

<div class="absolute-center-x absolute-center-y">
	<div class="tooltip" data-tip="Zum Bearbeiten klicken.">
		<a href={`/users/${data.user.id}/edit?year=${$yearStore}`}>
			<div class="stats border">
				<div class="stat place-items-center">
					<div class="stat-title">Name</div>
					<div class="stat-value">{data.user.name}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">Rolle</div>
					<div class="stat-value">{data.user.role}</div>
				</div>
			</div>
		</a>
		<!-- link to the game if the user has one -->
		{#if data.user.game_id}
			<a href={`/games/${data.user.game_id}`}>
				<div class="stat place-items-center">
					<div class="stat-title">Spiel</div>
					<div class="stat-value">{data.user.game_name}</div>
				</div>
			</a>
		{/if}
	</div>
</div>

{#if showDeletion}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<dialog class="modal modal-open" onclick={(e) => onClickOutside(e)}>
		<form id="confirmation-form" class="modal-box" bind:this={modalContent}>
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={closeDeletion}
				>✕</button
			>

			<h1 class="font-bold text-xl text-center pb-2">
				Nutzer "{data.user.name}" wirklich löschen?
			</h1>
			<p class="text-center pb-6">Bitte gib den Namen des Nutzers ein, um es zu löschen.</p>
			<input
				class="input input-bordered w-full"
				name="input"
				type="text"
				required
				bind:value={nameInput}
			/>

			<div class="modal-action flex flex-row justify-between">
				<button class="btn btn-secondary" onclick={closeDeletion}> Abbrechen </button>
				<button
					class="btn btn-primary"
					class:btn-disabled={data.user.name !== nameInput}
					onclick={handleDelete}>Löschen</button
				>
			</div>
		</form>
	</dialog>
{/if}
